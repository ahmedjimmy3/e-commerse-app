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
// import { nanoid } from "nanoid"
// import createInvoice from "../../utils/pdf-kit.js"
import { createCheckoutSession, createStripeCoupon ,createPaymentIntent, confirmPaymentIntent, refundPaymentIntent} from "../../payment-handler/stripe.js"

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

    // const orderCode = `${req.authUser.username}_${nanoid(3)}`
    // // generate invoice object
    // const orderInvoice = {
    //     shipping:{
    //         name:req.authUser.username,
    //         address:orderObj.shippingAddress.address,
    //         city:orderObj.shippingAddress.city,
    //         postalCode:orderObj.shippingAddress.postalCode,
    //         country:orderObj.shippingAddress.country,
    //     },
    //     orderCode,
    //     date:orderObj.createdAt,
    //     items:[{
    //         orderId:orderObj._id,
    //         user:orderObj.user,
    //         totalPrice:orderObj.totalPrice,
    //         orderStatus:orderObj.orderStatus
    //     }],
    //     subTotal:totalPrice,
    //     paidAmount:shippingPrice
    // }
    // createInvoice(orderInvoice,`${orderCode}.pdf`)

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

export const payWithStripe = async(req,res,next)=>{
    const {orderId} = req.params
    const {_id:userId} = req.authUser
    // get order details
    const order = await Order.findOne({_id:orderId , user:userId, orderStatus:ordersStatus.PENDING})
    if(!order){return next({message:'order not found',cause:404})}

    const paymentObject = {
        customer_email:req.authUser.email,
        metadata:{orderId: order._id.toString()},
        discounts:[],
        line_items:order.orderItems.map(item=>{
            return {
                price_data:{
                    currency:'EGP',
                    product_data:{
                        name:item.title,
                    },
                    unit_amount:item.price * 100
                },
                quantity:item.quantity
            }
        })
    }

    // coupon check
    if(order.coupon){
        const stripeCoupon = await createStripeCoupon({couponId:order.coupon})
        if(stripeCoupon.status){return next(new Error(`${stripeCoupon.message}`,{cause:`${stripeCoupon.status}`}))}
        paymentObject.discounts.push({
            coupon:stripeCoupon.id
        })
    }

    const checkoutSession = await createCheckoutSession(paymentObject)
    const paymentIntent = await createPaymentIntent({amount:order.totalPrice,currency:'EGP'})
    order.paymentIntent = paymentIntent.id
    await order.save()

    res.status(200).json({checkoutSession,paymentIntent})
}

export const stripeWebhook = async(req,res,next)=>{
    const orderId = req.body.data.object.metadata.orderId

    const confirmedOrder = await Order.findById(orderId)

    await confirmPaymentIntent({paymentIntentId:confirmedOrder.paymentIntent})

    confirmedOrder.isPaid = true,
    confirmedOrder.paidAt = DateTime.now().toFormat('yy-MM-dd HH:mm:ss')
    confirmedOrder.orderStatus = ordersStatus.PAID
    await confirmedOrder.save()

    res.status(200).json({message:'webhook received'})
}

export const refundOrder = async(req,res,next)=>{
    const {orderId} = req.params
    const order = await Order.findOne({_id:orderId,orderStatus:ordersStatus.PAID})
    if(!order){return next({message:'order not found',cause:404})}

    // refund
    const refund = await refundPaymentIntent({paymentIntentId:order.paymentIntent})

    order.orderStatus = ordersStatus.REFUNDED
    await order.save()
    res.status(200).json({message:'Order refunded successfully',data:refund})
}