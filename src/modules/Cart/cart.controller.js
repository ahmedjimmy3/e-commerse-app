import Cart from "../../../db/models/cart.model.js";
import { getUserCart } from "./utils/get-user-cart.js";
import { checkProductAvailability } from "./utils/check-product-in-db.js";
import { createCart } from "./utils/create-cart.js";
import { updateProductQuantity } from "./utils/update-product-quantity.js";
import { pushNewProduct } from "./utils/add-product-to-cart.js";

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

    const product = await checkProductAvailability(quantity,productId)
    if(!product){return next(new Error('Product not found or not available',{cause:404}))}

    const userCart = await getUserCart(_id)
    if(!userCart){
        const createdCart = await createCart(_id,productId,quantity,product)
        return res.status(201).json({message:'Product added successfully', data:createdCart})
    }

    const isUpdated = await updateProductQuantity(userCart,productId,quantity)
    if(!isUpdated){
        const added = await pushNewProduct(userCart,product,quantity)
        if(!added){return next(new Error('Product not added to cart',{cause:400}))}
    }
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