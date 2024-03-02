import * as subCategoryRepo from './sub-category.repo.js'
import cloudinary from '../../utils/cloduinary.js'
import Category from '../../../db/models/category.model.js'
import slugify from 'slugify'
import generateUniqueString from '../../utils/generate-unique-string.js'
import SubCategory from '../../../db/models/sub-category.model.js'
import Brand from '../../../db/models/brand.model.js'
import Product from '../../../db/models/product.model.js'

export const createSubCategoryFunction=  async(name,categoryId,_id,req)=>{
    const isNameDuplicate = await subCategoryRepo.getSubCategoryWithName(name)
    if(isNameDuplicate){throw({message:'This name is used',cause:409})}
    const category = await Category.findById(categoryId)
    if(!category){throw({message:'This category not found',cause:404})}
    const slug = slugify(name,'-')
    if(!req.file){
        throw({message:'Please upload image',cause:400})
    }
    const folderId = generateUniqueString(6)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/Categories/${category.folderId}/subCategories/${folderId}`
    })
    const newSubCategory = {
        name,
        slug,
        Image:{ secure_url , public_id },
        folderId,
        addedBy:_id,
        categoryId
    }
    const subCategoryCreated = await subCategoryRepo.createSubCategory(newSubCategory)
    return subCategoryCreated
}

export const getAllSubCategoriesFunction = async()=>{
    const subCategories = await SubCategory.find().populate([{  
        path:'Brands' ,
        select:'-_id -folderId',
        populate: [{
            path:'Products'
        }],
    }])
    return subCategories
}

export const deleteSubCategoryFunction = async(subCategoryId)=>{
    const deletedDone = await subCategoryRepo.deleteSubCategoryById(subCategoryId)
    if(!deletedDone){
        throw({message:'Deletion Failed',cause:400})
    }
    const brandDeletion = await Brand.deleteMany({subCategoryId})
    if(!brandDeletion.deletedCount){console.log('No Brands')}
    const productDeletion = await Product.deleteMany({subCategoryId})
    if(!productDeletion.deletedCount){console.log('No Products')}

    const folderPath = deletedDone.Image.public_id.split(`${deletedDone.folderId}/`)[0]
    await cloudinary.api.delete_resources_by_prefix(folderPath+`${deletedDone.folderId}`)
    await cloudinary.api.delete_folder(folderPath+`${deletedDone.folderId}`)
    return deletedDone
}

export const updateSubCategoryFunction = async({subCategoryId,name,oldPublicId,_id,req})=>{
    const subCategoryFound = await subCategoryRepo.getSubCategoryById(subCategoryId)
    if(!subCategoryFound){throw({message:'SubCategory not found',cause:404})}
    if(name){
        const checkName = await subCategoryRepo.getSubCategoryWithName(name)
        if(checkName){throw({message:'This sub-category name is used',cause:409})}
        if(subCategoryFound.name == name){
            throw({message:'You should enter new name',cause:400})
        }
        subCategoryFound.name = name
        subCategoryFound.slug = slugify(name,'-')
    }
    if(oldPublicId){
        if(oldPublicId!= subCategoryFound.Image.public_id){
            throw({message:'You should enter valid oldPublicId',cause:400})
        }
        if(!req.file){throw({message:'Please upload image',cause:400})}
        const {secure_url} = await cloudinary.uploader.upload(req.file.path,{
            public_id:oldPublicId
        })
        subCategoryFound.Image.secure_url = secure_url
    }
    subCategoryFound.updatedBy = _id
    await subCategoryFound.save()
    return subCategoryFound
}