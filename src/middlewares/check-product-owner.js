import Product from "../../db/models/product.model.js"
import systemRoles from "../utils/system-roles.js"

const checkProductOwner = async(req,res,next)=>{
    const {productId} = req.params
    const {_id} = req.authUser
    const product = await Product.findById(productId)
    if(!product){return next(new Error('Product not found',{cause:404}))}
    if(product.addedBy.toString() != _id.toString() && req.authUser.role != systemRoles.SUPER_ADMIN){
        return next(new Error('You can not do this not auth',{cause:401}))
    }
    next()
}

export default checkProductOwner