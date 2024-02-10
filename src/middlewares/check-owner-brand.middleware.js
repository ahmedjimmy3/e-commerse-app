import Brand from "../../db/models/brand.model.js"

const checkOwnerBrand = async(req,res,next)=>{
    const {brandId} = req.params
    const {_id} = req.authUser
    const brandFound = await Brand.findById(brandId)
    if(!brandFound){return next(new Error('Brand not Found',{cause:404}))}
    if(brandFound.addedBy.toString() != _id.toString()){
        return next(new Error('You are not auth to do this',{cause:401}))
    }
    next()
}

export default checkOwnerBrand