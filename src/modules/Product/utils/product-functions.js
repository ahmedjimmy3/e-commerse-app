import Brand from "../../../../db/models/brand.model.js"
import cloudinary from "../../../utils/cloduinary.js"

export const checkBrand = async(brandId)=>{
    const brandCheck = await Brand.findById(brandId).populate([
        {path:'categoryId', select:'folderId'},
        {path:'subCategoryId', select:'folderId'},
    ]) 
    return brandCheck
}

export const uploadImages = async(brandCheck, req,folderId,folder)=>{
    let Images = []
    for (const file of req.files) {
        const {secure_url,public_id} = await cloudinary.uploader.upload(file.path, {
            folder: folder + `${brandCheck.folderId}` + `/Products/${folderId}`
        })
        Images.push({secure_url,public_id})
    }
    return Images
}