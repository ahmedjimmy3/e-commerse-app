import { calcSubTotal } from "./calculate-sub-total.js";

export async function pushNewProduct(userCart, product, quantity) {
    userCart.products.push({
        productId: product._id,
        quantity,
        basePrice: product.appliedPrice,
        finalPrice: product.appliedPrice * quantity,
        title: product.title,
    });
    userCart.subTotal = calcSubTotal(userCart)
    return await userCart.save()
}
