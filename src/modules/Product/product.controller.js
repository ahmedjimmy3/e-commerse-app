import Product from "../../../db/models/product.model.js"
import Brand from '../../../db/models/brand.model.js'
import systemRoles from "../../utils/system-roles.js"
import slugify from 'slugify'
import cloudinary from "../../utils/cloduinary.js"
import generateUniqueString from "../../utils/generate-unique-string.js"
export const addProduct = async(req,res,next)=>{
    const {title,description,price,discount,stock,specifications} = req.body
    const {categoryId,subCategoryId,brandId} = req.query
    const {_id} = req.authUser

    const brandCheck = await Brand.findById(brandId).populate([
        {path:'categoryId', select:'folderId'},
        {path:'subCategoryId', select:'folderId'},
    ]) 
    if(!brandCheck){return next(new Error('This Brand not found',{cause:404}))}

    if(brandCheck.categoryId._id.toString() !== categoryId){
        return next(new Error('This Category not found',{cause:404}))
    }
    if(brandCheck.subCategoryId._id.toString() !== subCategoryId){
        return next(new Error('This SubCategory not found',{cause:404}))
    }

    if(brandCheck.addedBy.toString() !== _id.toString() && req.authUser.role!==systemRoles.SUPER_ADMIN){
        return next(new Error('You are not allow to add product in this brand',{cause:401}))
    }

    const slug = slugify(title,'-')

    const folderId = generateUniqueString(6)
    let Images = []
    for (const file of req.files) {
        const {secure_url,public_id} = await cloudinary.uploader.upload(file.path, {
            folder:`${process.env.MAIN_FOLDER}/Categories/${brandCheck.categoryId.folderId}/subCategories/${brandCheck.subCategoryId.folderId}/Brands/${brandCheck.folderId}/Products/${folderId}`
        })
        Images.push({secure_url,public_id})
    }
    req.folder = {folderPath:`${process.env.MAIN_FOLDER}/Categories/${brandCheck.categoryId.folderId}/subCategories/${brandCheck.subCategoryId.folderId}/Brands/${brandCheck.folderId}/Products/${folderId}`}
    
    const appliedPrice = price - (((discount||0)*price) / 100)

    const newProduct = {
        categoryId,subCategoryId,brandId,addedBy:_id,folderId,Images,
        title,description,slug,price,discount,appliedPrice,stock,specifications,
    }
    const createdProduct = await Product.create(newProduct)
    req.createdDocument = {model:Product, query:createdProduct._id}
    const z=9
    z=8

    res.status(201).json({message:'Created Product Done', createdProduct})
}