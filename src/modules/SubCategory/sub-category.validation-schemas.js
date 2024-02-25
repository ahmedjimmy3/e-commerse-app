import Joi from 'joi'
import generalValidationRules from '../../utils/general-validation-rules.js'

export const addSubCategorySchema = {
    body:Joi.object({
        name:Joi.string().required(),
        image:Joi.boolean().valid(true)
    }),
    params:Joi.object({
        categoryId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}

export const deleteSubCategorySchema = {
    params:Joi.object({
        subCategoryId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}

export const updateSubCategorySchema = {
    body:Joi.object({
        name:Joi.string(),
        image:Joi.boolean().valid(true),
        oldPublicId:Joi.string()
    }).xor('image','oldPublicId'),
    params:Joi.object({
        subCategoryId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}