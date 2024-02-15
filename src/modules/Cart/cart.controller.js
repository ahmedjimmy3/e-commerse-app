import Cart from "../../../db/models/cart.model.js";
import Product from "../../../db/models/product.model.js";

/**
 * @param {productId , quantity} from req.body
 * @param {userId} from req.authUser
 * @description: 1- check if product exists and if it's available
 * check if loggedInUser have a cart
 * if he has a cart than check if the product is already in the cart
 * if it exist then update quantity and finalPrice
 * if not exist then add the product to the cart
 * 
 * if there is no cart , add cart to db abd the product to the cart
 */

export const addProductToCart = async(req,res,next)=>{
    const {productId , quantity} = req.body
    const {_id} = req.authUser

    const product = await Product.findById(productId)
    if(!product){return next(new Error('Product not found',{cause:404}))}
    if(product.stock<quantity){return next(new Error('This quantity not available',{cause:400}))}

    const userCart = await Cart.findOne({userId:_id})
    if(!userCart){
        const cartObj = {
            userId:_id,
            products:[
                {
                    productId,
                    quantity,
                    basePrice: product.appliedPrice,
                    finalPrice: product.appliedPrice * quantity,
                    title: product.title
                }
            ],
            subTotal: product.appliedPrice * quantity
        }
        const createdCart = await Cart.create(cartObj)
        return res.status(201).json({message:'Product added successfully', data:createdCart})
    }

    let isProductExist = false
    for (const product of userCart.products) {
        if(product.productId.toString() === productId){
            product.quantity = quantity
            product.finalPrice = product.basePrice * quantity
            isProductExist = true
        }
    }

    if(!isProductExist){
        userCart.products.push({
            productId,
            quantity,
            basePrice: product.appliedPrice,
            finalPrice: product.appliedPrice * quantity,
            title: product.title
        })
    }

    let newSubTotal = 0
    for (const pro of userCart.products) {
        newSubTotal += pro.finalPrice
    }
    userCart.subTotal = newSubTotal

    await userCart.save()
    res.status(200).json({message:'Product added successfully',data:userCart})

}

export const removeFromCart = async(req,res,next)=>{
    const {productId} = req.params
    const {_id} = req.authUser

    const userCart = await Cart.findOne({userId:_id , 'products.productId':productId})
    if(!userCart){return next(new Error('Product not found in cart',{cause:404}))}

    userCart.products = userCart.products.filter(product => product.productId.toString() !== productId )

    let subTotal = 0
    for (const product of userCart.products) {
        subTotal += product.finalPrice
    }
    userCart.subTotal = subTotal

    const newCart = await userCart.save()

    if(newCart.products.length==0){
        await Cart.findByIdAndDelete(newCart._id)
    }

    res.status(200).json({message:'Product deleted done'})
}