import * as brandRepo from './brand.repo.js'
import SubCategory from '../../../db/models/sub-category.model.js'
import slugify from 'slugify'
import generateUniqueString from '../../utils/generate-unique-string.js'
import cloudinary from '../../utils/cloduinary.js'
import Brand from '../../../db/models/brand.model.js'
import Product from '../../../db/models/product.model.js'

export const createBrandFunction = async (subCategoryId,name,categoryId,req,_id)=>{
    const isSubCategoryExist = await SubCategory.findById(subCategoryId).populate('categoryId')
    if(!isSubCategoryExist){throw({message:'This sub-category not found',cause:404})}
    const isBrandExist = await brandRepo.findBrandWithNameAndSubCategoryId(name,subCategoryId)
    if(isBrandExist){throw({message:'This brand already exist',cause:400})}
    if(isSubCategoryExist.categoryId._id.toString() != categoryId){
        throw({message:'Category not found',cause:404})
    }
    const slug = slugify(name,'-')
    if(!req.file){throw({message:'Please upload brand logo',cause:400})}
    const folderId = generateUniqueString(6)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.MAIN_FOLDER}/Categories/${isSubCategoryExist.categoryId.folderId}/subCategories/${isSubCategoryExist.folderId}/Brands/${folderId}`
    })
    req.folder = `${process.env.MAIN_FOLDER}/Categories/${isSubCategoryExist.categoryId.folderId}/subCategories/${isSubCategoryExist.folderId}/Brands/${folderId}`
    const newBrand = {
        name,
        slug,
        Image:{secure_url,public_id},
        folderId,
        addedBy: _id,
        categoryId,
        subCategoryId
    }
    const createdBrand = await brandRepo.createBrand(newBrand)
    req.createdDocument = {model:Brand , query:createdBrand._id}
    if(!createdBrand){
        throw({message:'Brand does not created',cause:400})
    }
    return createdBrand
}

export const getAllBrandsFunction = async function(){
    const brands = await brandRepo.getAllBrands()
    return brands
}

export const updateBrandFunction = async function(brandId,name,oldPublicId,req,_id){
    const brandInfo = await brandRepo.getBrandById(brandId)
    if(name){
        if(brandInfo.name == name){throw({message:'You must enter new name',cause:400})}
        brandInfo.name = name
        brandInfo.slug = slugify(name,'-')
    }
    if(oldPublicId){
        if(oldPublicId != brandInfo.Image.public_id){
            throw({message:'You should enter oldPublicId true',cause:400})
        }
        if(!req.file){throw({message:'You must upload image',cause:400})}
        const {secure_url} = await cloudinary.uploader.upload(req.file.path,{
            public_id:oldPublicId
        })
        brandInfo.Image.secure_url = secure_url
    }
    brandInfo.updatedBy = _id
    await brandInfo.save()
    return brandInfo
}

export const deleteBrandFunction = async function(brandId){
    const brandDeleted = await brandRepo.deleteBrand(brandId)
    if(!brandDeleted){throw({message:'Failed to delete this brand',cause:400})}

    const deleteProducts = await Product.deleteMany({brandId})
    if(!deleteProducts.deletedCount){console.log('No Products')}

    const folderPath = brandDeleted.Image.public_id.split(`${brandDeleted.folderId}/`)[0]
    const path = folderPath+`${brandDeleted.folderId}`
    await cloudinary.api.delete_resources_by_prefix(path)
    await cloudinary.api.delete_folder(path)
    return brandDeleted
}

export const getAllBrandsToSpecificSubCategoryFunction = async function(subCategoryId){
    const brands = await brandRepo.getBrandsToSpecificSubCategory(subCategoryId)
    if(!brands.length){throw({message:'There are no brands to this sub-category',cause:404})}
    return brands
}

export const getAllBrandsToSpecificCategoryFunction = async function(categoryId){
    const brands = await brandRepo.getBrandsToSpecificCategory(categoryId)
    if(!brands.length){throw({message:'There are no brands to this category',cause:404})}
    return brands
}