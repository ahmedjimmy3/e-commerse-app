import Joi from 'joi'
import generalValidationRules from '../../utils/general-validation-rules.js'

export const addCategorySchema = {
    body:Joi.object({
        name:Joi.string().required(),
        image:Joi.string().required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()}),
}

export const updateCategorySchema = {
    body:Joi.object({
        oldPublicId:Joi.string(),
        image:Joi.string().valid(true),
        name:Joi.string()
    }).with('image', 'oldPublicId'),
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