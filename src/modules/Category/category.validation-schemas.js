import Joi from 'joi'
import generalValidationRules from '../../utils/general-validation-rules.js'

export const addCategorySchema = {
    body:Joi.object({
        name:Joi.string().required(),
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()}),
}

export const updateCategorySchema = {
    body:Joi.object({
        name:Joi.string(),
        oldPublicId:Joi.string()
    }),
    params:Joi.object({
        categoryId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}

export const deleteCategorySchema = {
    params:Joi.object({
        categoryId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}

export const getCategoryByIdSchema = {
    params:Joi.object({
        categoryId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string()})
}