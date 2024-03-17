import { getUserCart } from "./utils/get-user-cart.js";
import { checkProductAvailability } from "./utils/check-product-in-db.js";
import { createCart } from "./utils/create-cart.js";
import { updateProductQuantity } from "./utils/update-product-quantity.js";
import { pushNewProduct } from "./utils/add-product-to-cart.js";
import Cart from "../../../db/models/cart.model.js";
import { calcSubTotal } from "./utils/calculate-sub-total.js";


export const addProductToCartFunction = async(productId,quantity,_id)=>{
    const product = await checkProductAvailability(quantity,productId)
    if(!product){throw ({message:'Product not found or not available',cause:404})}

    const userCart = await getUserCart(_id)
    if(!userCart){
        const createdCart = await createCart(_id,productId,quantity,product)
        return createdCart
    }
    const isUpdated = await updateProductQuantity(userCart,productId,quantity)
    if(!isUpdated){
        const added = await pushNewProduct(userCart,product,quantity)
        if(!added){throw({message:'Product not added to cart',cause:400})}
    }
    return userCart
}

export const removeProductFromCartFunction = async(productId,_id)=>{
    const userCart = await Cart.findOne({userId:_id , 'products.productId':productId})
    if(!userCart){throw({message:'Product not found in the cart',cause:404})}

    userCart.products = userCart.products.filter(product => product.productId.toString() !== productId )

    userCart.subTotal = calcSubTotal(userCart)

    const newCart = await userCart.save()

    if(newCart.products.length==0){
        await Cart.findByIdAndDelete(newCart._id)
    }
    return newCart
}