import * as categoryRepo from './category.repo.js'
import cloudinary from '../../utils/cloduinary.js'
import slugify from 'slugify'
import generateUniqueString from '../../utils/generate-unique-string.js'
import Category from '../../../db/models/category.model.js'
import SubCategory from '../../../db/models/sub-category.model.js'
import Brand from '../../../db/models/brand.model.js'
import Product from '../../../db/models/product.model.js'

export const addCategoryFunction = async(name,req,_id)=>{
    const isNameDuplicate = await categoryRepo.getCategoryByName(name)
    if(isNameDuplicate){throw({message:'This name already used',cause:409})}
    const slug = slugify(name,'-')
    if(!req.file){
        throw({message:'Please upload image',cause:400})
    }
    const folderId = generateUniqueString(6)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/Categories/${folderId}`
    })
    req.folder = `${process.env.MAIN_FOLDER}/Categories/${folderId}`
    const newCategory = {
        name,
        slug,
        Image:{ secure_url , public_id },
        folderId,
        addedBy:_id
    }
    const categoryCreated = await categoryRepo.createCategory(newCategory)
    req.createdDocument = {model:Category , query:categoryCreated._id}
    return categoryCreated
}

export const updateCategoryFunction =async({categoryId,req,name,oldPublicId,_id})=>{
    const categoryFound = await categoryRepo.findCategoryById(categoryId)
    if(!categoryFound){throw({message:'This category not found',cause:404})}
    if(name){
        if(name == categoryFound.name){throw({message:'Enter different names',cause:400})}
        const isNameDuplicate = await categoryRepo.getCategoryByName(name)
        if(isNameDuplicate){throw({message:'This name is used',cause:409})}
        categoryFound.name = name
        categoryFound.slug = slugify(name,'-')
    }
    if(oldPublicId){
        if(!req.file){throw({message:'Please upload image',cause:400})}
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
            public_id: oldPublicId
        })
        categoryFound.Image = {secure_url , public_id}
    }
    categoryFound.updatedBy = _id
    await categoryFound.save()
    return categoryFound
}

export const getAllCategoriesFunction = async()=>{
    const allCategories = await Category.find().populate([{
        path:'Sub-Categories' ,
        populate:[{
            path:'Brands',
            populate:[{
                path:'Products',
            }]
        }]
    }])
    return allCategories
}

export const deleteCategoryFunction = async(categoryId)=>{
    const category = await categoryRepo.deleteCategoryById(categoryId)
    if(!category){throw({message:'Category not found',cause:404})}
    const deleteSubCategories = await SubCategory.deleteMany({categoryId})
    if(!deleteSubCategories.deletedCount){
        console.log('No sub-categories')
    }
    const deleteBrands = await Brand.deleteMany({categoryId})
    if(!deleteBrands.deletedCount){
        console.log('No Brands')
    }
    const deleteProducts = await Product.deleteMany({categoryId})
    if(!deleteProducts.deletedCount){
        console.log('No Products')
    }

    await cloudinary.api.delete_resources_by_prefix(`${process.env.MAIN_FOLDER}/Categories/${category.folderId}`)
    await cloudinary.api.delete_folder(`${process.env.MAIN_FOLDER}/Categories/${category.folderId}`)

    return category
}