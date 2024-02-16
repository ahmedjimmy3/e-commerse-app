import Cart from "../../../../db/models/cart.model.js";
export async function createCart(userId,productId,quantity,product){
    const cartObj = {
        userId,
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
    return createdCart
}