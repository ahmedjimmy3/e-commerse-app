import SubCategory from "../../../db/models/sub-category.model.js"
import Category from '../../../db/models/category.model.js'
import slugify from 'slugify'
import generateUniqueString from '../../utils/generate-unique-string.js'
import cloudinary from "../../utils/cloduinary.js"
import Brand from "../../../db/models/brand.model.js"
import Product from "../../../db/models/product.model.js"

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

export const allSubCategories = async(req,res,next)=>{
    const subCategories = await SubCategory.find().populate([
        {path:'Brands' , select:'-_id -folderId'}
    ])
    res.status(200).json({message:'All sub-categories with their brands',subCategories})
}

export const updateSubCategory = async(req,res,next)=>{
    const {subCategoryId} = req.params
    const {name,oldPublicId} = req.body
    const {_id} = req.authUser
    const subCategoryFound = await SubCategory.findById(subCategoryId)
    if(!subCategoryFound){return next(new Error('Sub-Category not found',{cause:404}))}
    if(name){
        const checkName = await SubCategory.findOne({name})
        if(checkName){return next(new Error('This sub-category name found yet',{cause:409}))}
        if(subCategoryFound.name == name){
            return next(new Error('You should enter new name',{cause:400}))
        }
        subCategoryFound.name = name
        subCategoryFound.slug = slugify(name,'-')
    }
    if(oldPublicId){
        if(oldPublicId!= subCategoryFound.Image.public_id){
            return next(new Error('You should enter oldPublicId true',{cause:400}))
        }
        if(!req.file){return next(new Error('Please upload image',{cause:400}))}
        const {secure_url} = await cloudinary.uploader.upload(req.file.path,{
            public_id:oldPublicId
        })
        subCategoryFound.Image.secure_url = secure_url
    }
    subCategoryFound.updatedBy = _id
    await subCategoryFound.save()

    res.status(200).json({message:'Updated Done....'})
}

export const deleteSubCategory = async(req,res,next)=>{
    const {subCategoryId} = req.params
    const deletedDone = await SubCategory.findByIdAndDelete(subCategoryId)
    if(!deletedDone){
        return next(new Error('Deletion Failed',{cause:400}))
    }
    const brandDeletion = await Brand.deleteMany({subCategoryId})
    if(!brandDeletion.deletedCount){console.log('No Brands')}
    const productDeletion = await Product.deleteMany({subCategoryId})
    if(!productDeletion.deletedCount){console.log('No Products')}

    const folderPath = deletedDone.Image.public_id.split(`${deletedDone.folderId}/`)[0]
    await cloudinary.api.delete_resources_by_prefix(folderPath)
    await cloudinary.api.delete_folder(folderPath)

    res.status(200).json({message:'Deleted Done:)'})
}