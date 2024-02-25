import Joi from 'joi'
import generalValidationRules from '../../utils/general-validation-rules.js'

export const addProductSchema = {
    query:Joi.object({
        categoryId:generalValidationRules.dbId.required(),
        subCategoryId:generalValidationRules.dbId.required(),
        brandId:generalValidationRules.dbId.required()
    }),
    body:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        basePrice:Joi.number().required(),
        stock:Joi.number().integer().required(),
        discount:Joi.number().integer(),
        specifications:Joi.string(),
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}

export const updateProductSchema = {
    body:Joi.object({
        title:Joi.string(),
        description:Joi.string(),
        basePrice:Joi.number(),
        stock:Joi.number().integer(),
        discount:Joi.number().integer(),
        specifications:Joi.string(),
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}

export const deleteProductSchema = {
    params:Joi.object({
        productId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}