import Category from "../../../db/models/category.model.js";

export const getCategoryByName = async(name)=>{
    return await Category.findOne({name})
}

export const createCategory = async(data)=>{
    return await Category.create(data)
}

export const findCategoryById = async(categoryId)=>{
    return await Category.findById(categoryId)
}

export const deleteCategoryById = async(categoryId)=>{
    return await Category.findByIdAndDelete(categoryId)
}