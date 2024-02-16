import { calcSubTotal } from "./calculate-sub-total.js";
import { checkProductIfExistInCart } from "./check-product-in-cart.js";

export async function updateProductQuantity(userCart,productId,quantity){
    const isProductExist = checkProductIfExistInCart(userCart,productId)
    if(!isProductExist){return null}

    userCart?.products.forEach(product => {
        if(product.productId.toString() === productId){
            product.quantity = quantity
            product.finalPrice = quantity * product.basePrice
        }
    });
    
    userCart.subTotal = calcSubTotal(userCart)
    return await userCart.save()
}