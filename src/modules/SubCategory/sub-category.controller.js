import * as subCategoryServices from './sub-category.services.js'

export const addSubCategory = async(req,res,next)=>{
    const { name } = req.body
    const {categoryId}  =req.params
    const {_id} = req.authUser
    const subCategoryCreated = await subCategoryServices.createSubCategoryFunction(name,categoryId,_id,req)
    res.status(201).json({message:'Sub-category created successfully',subCategoryCreated})
}

export const allSubCategories = async(req,res,next)=>{
    const subCategories = await subCategoryServices.getAllSubCategoriesFunction()
    res.status(200).json({message:'All sub-categories with their brands',subCategories})
}

export const updateSubCategory = async(req,res,next)=>{
    const {subCategoryId} = req.params
    const {name,oldPublicId} = req.body
    const {_id} = req.authUser
    const subCategoryFound = await subCategoryServices.updateSubCategoryFunction({subCategoryId,name,oldPublicId,_id,req})
    res.status(200).json({message:'Updated Done....',data:subCategoryFound})
}

export const deleteSubCategory = async(req,res,next)=>{
    const {subCategoryId} = req.params
    await subCategoryServices.deleteSubCategoryFunction(subCategoryId)
    res.status(200).json({message:'Deleted Done:)'})
}