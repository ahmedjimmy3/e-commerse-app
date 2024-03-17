import * as cartServices from './cart.services.js'

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
    const userCart = await cartServices.addProductToCartFunction(productId,quantity,_id)
    res.status(200).json({message:'Product added successfully',data:userCart})
}

export const removeFromCart = async(req,res,next)=>{
    const {productId} = req.params
    const {_id} = req.authUser
    await cartServices.removeProductFromCartFunction(productId,_id);
    res.status(200).json({message:'Product deleted done'})
}