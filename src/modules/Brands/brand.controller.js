import { query } from 'express'
import Brand from '../../../db/models/brand.model.js'
import Product from '../../../db/models/product.model.js'
import SubCategory from '../../../db/models/sub-category.model.js'
import cloudinary from '../../utils/cloduinary.js'
import generateUniqueString from '../../utils/generate-unique-string.js'
import slugify from 'slugify'

export const addBrand = async(req,res,next)=>{
    const {name} = req.body
    const {categoryId , subCategoryId} = req.query
    const {_id} = req.authUser

    const isSubCategoryExist = await SubCategory.findById(subCategoryId).populate('categoryId')
    if(!isSubCategoryExist){return next(new Error('This sub-category not found',{cause:404}))}

    const isBrandExist = await Brand.findOne({name},{subCategoryId})
    if(isBrandExist){return next(new Error('This brand already exist',{cause:400}))}

    if(isSubCategoryExist.categoryId._id.toString() != categoryId){
        return next(new Error('Category not found',{cause:404}))
    }

    const slug = slugify(name,'-')

    if(!req.file){return next(new Error('please upload the brand logo..',{cause:400}))}
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
    const createdBrand = await Brand.create(newBrand)
    req.createdDocument = {model:Brand , query:createdBrand._id}

    res.status(201).json({message:'Brand created successfully' , data:createdBrand})
}

export const allBrands = async(req,res,next)=>{
    const brands = await Brand.find().select('-_id -folderId')
    res.status(200).json({message:'All Brands', data:brands})
}

export const updateBrand = async(req,res,next)=>{
    const {brandId} = req.params
    const {name,oldPublicId} = req.body
    const {_id} = req.authUser
    const brandInfo = await Brand.findById(brandId)
    if(name){
        if(brandInfo.name == name){return next(new Error('You must enter new name',{cause:400}))}
        brandInfo.name = name
        brandInfo.slug = slugify(name,'-')
    }
    if(oldPublicId){
        if(oldPublicId != brandInfo.Image.public_id){
            return next(new Error('You should enter oldPublicId true',{cause:400}))
        }
        if(!req.file){return next(new Error('You must upload image',{cause:400}))}
        const {secure_url} = await cloudinary.uploader.upload(req.file.path,{
            public_id:oldPublicId
        })
        brandInfo.Image.secure_url = secure_url
    }
    brandInfo.updatedBy = _id
    await brandInfo.save()
    res.status(200).json({message:'Updated Done..'})
}

export const deleteBrand = async(req,res,next)=>{
    const {brandId} = req.params
    const brandDeleted = await Brand.findByIdAndDelete(brandId)
    if(!brandDeleted){return next(new Error('Failed to delete this brand',{cause:400},))}

    const deleteProducts = await Product.deleteMany({brandId})
    if(!deleteProducts.deletedCount){console.log('No Products')}

    const folderPath = brandDeleted.Image.public_id.split(`${brandDeleted.folderId}/`)[0]
    const path = folderPath+`${brandDeleted.folderId}`
    await cloudinary.api.delete_resources_by_prefix(path)
    await cloudinary.api.delete_folder(path)

    res.status(200).json({message:'Deleted Done..'})
}