import Cart from '../../../../db/models/cart.model.js'
export async function getUserCart(userId){
    const userCart = await Cart.findOne({userId})
    return userCart
}