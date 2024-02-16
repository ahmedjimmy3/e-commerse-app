export function checkProductIfExistInCart(userCart,productId){
    return userCart.products.some(
        (product) => product.productId.toString() === productId
    )
}