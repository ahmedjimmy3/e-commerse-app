import * as categoryServices from './category.services.js'

export const addCategory = async(req,res,next)=>{
    const { name } = req.body
    const {_id} = req.authUser
    const categoryCreated = await categoryServices.addCategoryFunction(name,req,_id)
    res.status(201).json({message:'Category created successfully',categoryCreated})
}

export const updateCategory = async(req,res,next)=>{
    const {name ,oldPublicId} = req.body
    const {categoryId} = req.params
    const {_id} = req.authUser
    const categoryFound = await categoryServices.updateCategoryFunction({name,oldPublicId,req,categoryId,_id})
    res.status(200).json({message:"Updated Done", categoryFound})
}

export const getAllCategories = async(req,res,next)=>{
    const allCategories = await categoryServices.getAllCategoriesFunction()
    res.status(200).json({message:'All categories',data:allCategories})
}

export const deleteCategory = async(req,res,next)=>{
    const {categoryId} = req.params
    await categoryServices.deleteCategoryFunction(categoryId)
    res.status(200).json({message:'Deleted Done'})
}

export const getCategoryById = async(req,res,next)=>{
    const {categoryId} = req.params
    const categoryFound = await categoryServices.getCategoryByIdFunction(categoryId)
    res.status(200).json({message:'Category found',data:categoryFound})
}