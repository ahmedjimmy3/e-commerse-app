import SubCategory from "../../../db/models/sub-category.model.js"
import Category from '../../../db/models/category.model.js'
import slugify from 'slugify'
import generateUniqueString from '../../utils/generate-unique-string.js'
import cloudinary from "../../utils/cloduinary.js"

export const addSubCategory = async(req,res,next)=>{
    const { name } = req.body
    const {categoryId}  =req.params
    const {_id} = req.authUser
    // check is this valid name
    const isNameDuplicate = await SubCategory.findOne({name})
    if(isNameDuplicate){return next(new Error('This name already used',{cause:409}))}
    // check if category found
    const category = await Category.findById(categoryId)
    if(!category){return next(new Error('Category not found',{cause:404}))}
    // slug
    const slug = slugify(name,'-')
    // upload image
    if(!req.file){
        return next(new Error('Please upload image',{cause:400}))
    }
    const folderId = generateUniqueString(6)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/Categories/${category.folderId}/subCategories/${folderId}`
    })
    // new Category
    const newSubCategory = {
        name,
        slug,
        Image:{ secure_url , public_id },
        folderId,
        addedBy:_id,
        categoryId
    }
    // create category
    const subCategoryCreated = await SubCategory.create(newSubCategory)
    res.status(201).json({message:'Sub-category created successfully',subCategoryCreated})
}