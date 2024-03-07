import Joi from 'joi'
import generalValidationRules from '../../utils/general-validation-rules.js'

export const addSubCategorySchema = {
    body:Joi.object({
        name:Joi.string().required(),
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
        oldPublicId:Joi.string()
    }),
    params:Joi.object({
        subCategoryId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}

export const getAllSubCategoriesToSpecificCategorySchema = {
    query:Joi.object({
        categoryId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string()})
}

export const getSubCategoryByIdSchema = {
    params:Joi.object({
        subCategoryId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string()})
}