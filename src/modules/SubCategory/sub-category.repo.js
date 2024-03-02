import SubCategory from "../../../db/models/sub-category.model.js";

export const createSubCategory = async(data)=>{
    return await SubCategory.create(data)
}

export const getSubCategoryWithName = async(name)=>{
    return await SubCategory.findOne({name})
}

export const deleteSubCategoryById = async(subCategoryId)=>{
    return await SubCategory.findByIdAndDelete(subCategoryId)
}

export const getSubCategoryById = async(subCategoryId)=>{
    return await SubCategory.findById(subCategoryId)
}