import Brand from "../../db/models/brand.model.js"
import systemRoles from "../utils/system-roles.js"

const checkOwnerORSuperAdmin = async(req,res,next)=>{
    const {brandId} = req.params
    const {_id} = req.authUser
    const brand = await Brand.findById(brandId)
    if(!brand){
        return next(new Error('Brand not found',{cause:404}))
    }
    if(brand.addedBy.toString() != _id.toString() && req.authUser.role != systemRoles.SUPER_ADMIN){
        return next(new Error('You are not auth to do this',{cause:401}))
    }
    next()
} 

export default checkOwnerORSuperAdmin