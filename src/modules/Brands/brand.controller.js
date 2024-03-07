import * as brandServices from './brand.services.js'

export const addBrand = async(req,res,next)=>{
    const {name} = req.body
    const {categoryId , subCategoryId} = req.query
    const {_id} = req.authUser
    const createdBrand = await brandServices.createBrandFunction(subCategoryId,name,categoryId,req,_id)
    res.status(201).json({message:'Brand created successfully' , data:createdBrand})
}

export const allBrands = async(req,res,next)=>{
    const brands = await brandServices.getAllBrandsFunction()
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

export const allBrandsToSpecificSubCategory = async(req,res,next)=>{
    const {subCategoryId} = req.query
    const brands = await brandServices.getAllBrandsToSpecificSubCategoryFunction(subCategoryId)
    res.status(200).json({message:'These are all brands for specific subCategory',data:brands})
}

export const allBrandsToSpecificCategory = async(req,res,next)=>{
    const {categoryId} = req.query
    const brands = await brandServices.getAllBrandsToSpecificCategoryFunction(categoryId)
    res.status(200).json({message:'These are all brands for specific subCategory',data:brands})
}