import { query } from 'express'
import Brand from '../../../db/models/brand.model.js'
import Product from '../../../db/models/product.model.js'
import SubCategory from '../../../db/models/sub-category.model.js'
import cloudinary from '../../utils/cloduinary.js'
import generateUniqueString from '../../utils/generate-unique-string.js'
import slugify from 'slugify'
import * as brandServices from './brand.services.js'

export const addBrand = async(req,res,next)=>{
    const {name} = req.body
    const {categoryId , subCategoryId} = req.query
    const {_id} = req.authUser
    const createdBrand = await brandServices.createBrandFunction(subCategoryId,name,categoryId,req,_id)
    res.status(201).json({message:'Brand created successfully' , data:createdBrand})
}

export const allBrands = async(req,res,next)=>{
    const brands = await brandServices.getAllProductsFunction()
    res.status(200).json({message:'All Brands', data:brands})
}

export const updateBrand = async(req,res,next)=>{
    const {brandId} = req.params
    const {name,oldPublicId} = req.body
    const {_id} = req.authUser
    const brandInfo = await brandServices.updateBrandFunction(brandId,name,oldPublicId,req,_id)
    res.status(200).json({message:'Updated Done..',data:brandInfo})
}

export const deleteBrand = async(req,res,next)=>{
    const {brandId} = req.params
    await brandServices.deleteBrandFunction(brandId)
    res.status(200).json({message:'Deleted Done..'})
}