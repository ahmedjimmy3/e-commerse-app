import Joi from 'joi'
import generalValidationRules from '../../utils/general-validation-rules.js'

export const addReviewSchema = {
    query:Joi.object({
        productId:generalValidationRules.dbId.required()
    }),
    body:Joi.object({
        reviewRate:Joi.number().integer().required(),
        reviewComment:Joi.string()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}

export const getAllReviewsToProductSchema = {
    query:Joi.object({
        productId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string()})
}

export const deleteReviewSchema = {
    params:Joi.object({
        reviewId:generalValidationRules.dbId.required(),
        productId:generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}