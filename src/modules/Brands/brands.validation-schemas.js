import Joi from 'joi'
import generalValidationRules from '../../utils/general-validation-rules.js'

export const addBrandSchema = {
    body:Joi.object({
        name:Joi.string().required()
    }),
    query:Joi.object({
        categoryId:generalValidationRules.dbId.required(),
        subCategoryId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}

export const updateBrandSchema = {
    body:Joi.object({
        name:Joi.string(),
        oldPublicId:Joi.string()
    }),
    params:Joi.object({
        brandId: generalValidationRules.dbId.required()
    }),
    headers: generalValidationRules.headersRule.append({token:Joi.string().required()})
}

export const deleteBrandSchema = {
    params:Joi.object({
        brandId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}