import CouponUsers from "../../../db/models/coupons-users.model.js"
import Order from "../../../db/models/order.model.js"
import Product from "../../../db/models/product.model.js"
import Cart from "../../../db/models/cart.model.js"
import { couponValidation } from "../../utils/apply-coupon-validation.js"
import ordersStatus from "../../utils/order-status.js"
import paymentMethods from "../../utils/payment-Methods.js"
import { checkProductAvailability } from "../Cart/utils/check-product-in-db.js"
import { getUserCart } from "../Cart/utils/get-user-cart.js"
import { DateTime } from "luxon"
import generateQrCode from "../../utils/qr-code.js"

export const createOrder = async(req,res,next)=>{
    const { quantity,product,couponCode,paymentMethod,
            phoneNumbers,address,city,postalCode,country,
    } = req.body
    const {_id: user} = req.authUser
    // check Coupon
    let coupon = null
    if(couponCode){
        const isValidCoupon = await couponValidation(couponCode,user)
        if(isValidCoupon.status){return next(new Error(isValidCoupon.message,{cause:isValidCoupon.status}))}
        coupon = isValidCoupon
    }
    // check product
    const isProductAvailable = await checkProductAvailability(quantity,product)
    if(!isProductAvailable){return next(new Error('Product is not available',{cause:400}))}
    // prepare orderItems
    let orderItems = [{
        title:isProductAvailable.title,
        quantity,
        product: isProductAvailable._id,
        price: isProductAvailable.appliedPrice
    }]
    // prices
    let shippingPrice = orderItems[0].price * quantity
    let totalPrice = shippingPrice
    if(coupon?.isFixed && shippingPrice <= coupon.couponAmount){
        return next(new Error('You can not use this coupon',{cause:400}))
    }else if(coupon?.isFixed){
        totalPrice = shippingPrice - coupon.couponAmount
    }else if(coupon?.isPercentage){
        totalPrice = shippingPrice - (shippingPrice * coupon.couponAmount / 100)
    }
    // order status and payment methods
    let orderStatus
    if(paymentMethod === paymentMethods.CASH) {orderStatus = ordersStatus.PLACED}
    // create order
    const orderObj = new Order({
        user,
        orderItems,
        shippingAddress:{country,address,city,postalCode},
        phoneNumbers,
        shippingPrice,
        coupon:coupon?._id,
        totalPrice,
        paymentMethod,
        orderStatus
    })
    await orderObj.save()
    if(coupon){
        await CouponUsers.updateOne({userId:user,couponId:coupon._id},{$inc:{usageCount: 1}})
    }
    isProductAvailable.stock -= quantity
    await isProductAvailable.save()

    // generate QRCode
    const QRCode = await generateQrCode([{
        orderId:orderObj._id,
        user:orderObj.user,
        totalPrice:orderObj.totalPrice,
        orderStatus:orderObj.orderStatus
    }])

    res.status(201).json({message:'Order created successfully',data:QRCode})
}

export const convertCartToOrder = async(req,res,next)=>{
    const {couponCode,paymentMethod,
        phoneNumbers,address,city,postalCode,country,
    } = req.body
    const {_id: user} = req.authUser
    // check cart
    const userCart = await getUserCart(user)
    if(!userCart){return next(new Error('Cart not found yet',{cause:404}))}
    // check Coupon
    let coupon = null
    if(couponCode){
        const isValidCoupon = await couponValidation(couponCode,user)
        if(isValidCoupon.status){return next(new Error(isValidCoupon.message,{cause:isValidCoupon.status}))}
        coupon = isValidCoupon
    }

    let orderItems = userCart.products.map(cartItem => {
        return {
            title:cartItem.title,
            quantity:cartItem.quantity,
            price:cartItem.basePrice,
            product:cartItem.productId
        }
    })
    // prices
    let shippingPrice = userCart.subTotal
    let totalPrice = shippingPrice
    if(coupon?.isFixed && shippingPrice <= coupon.couponAmount){
        return next(new Error('You can not use this coupon',{cause:400}))
    }else if(coupon?.isFixed){
        totalPrice = shippingPrice - coupon.couponAmount
    }else if(coupon?.isPercentage){
        totalPrice = shippingPrice - (shippingPrice * coupon.couponAmount / 100)
    }
    // order status and payment methods
    let orderStatus
    if(paymentMethod === paymentMethods.CASH) {orderStatus = ordersStatus.PLACED}
    // create order
    const orderObj = new Order({
        user,
        orderItems,
        shippingAddress:{country,address,city,postalCode},
        phoneNumbers,
        shippingPrice,
        coupon:coupon?._id,
        totalPrice,
        paymentMethod,
        orderStatus
    })
    await orderObj.save()
    await Cart.findByIdAndDelete(userCart._id)
    if(coupon){
        await CouponUsers.updateOne({userId:user,couponId:coupon._id},{$inc:{usageCount: 1}})
    }
    for (const item of orderItems) {
        await Product.updateOne({_id:item.product},{$inc:{stock: -item.quantity}})
    }

    res.status(201).json({message:'Order created successfully',data:orderObj})
}

export const orderDelivered = async(req,res,next)=>{
    const {orderId} = req.params
    const updatedOrder = await Order.findOneAndUpdate(
        {_id:orderId , orderStatus: {$in:[ordersStatus.PAID,ordersStatus.PLACED]}},
        {
            orderStatus:ordersStatus.DELIVERED,
            deliveredAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
            deliveredBy:req.authUser._id,
            isDelivered: true
        },
        {new:true}
    )
    if(!updatedOrder){
        return next(new Error('Order not found or can not be delivered',{cause:400}))
    }
    res.status(200).json({message:'Order delivered successfully', order: updatedOrder})
}