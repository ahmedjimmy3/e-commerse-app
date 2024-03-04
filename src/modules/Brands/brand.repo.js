import Brand from '../../../db/models/brand.model.js'

export const getBrandById = async function(brandId){
    return await Brand.findById(brandId)
}

export const findBrandWithNameAndSubCategoryId = async function(name,subCategoryId){
    return await Brand.findOne({name,subCategoryId})
}

export const createBrand = async function (data){
    return await Brand.create(data)
}

export const getAllBrands = async function(){
    return await Brand.find().select('-_id -folderId')
}

export const deleteBrand = async function(brandId){
    return await Brand.findByIdAndDelete(brandId)
}