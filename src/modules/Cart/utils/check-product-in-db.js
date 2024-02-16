import Product from "../../../../db/models/product.model.js"
export async function checkProductAvailability(quantity,productId){
    const product = await Product.findById(productId)
    if(!product || product.stock < quantity){return null}
    return product
}