import Joi from 'joi'
import generalValidationRules from '../../utils/general-validation-rules.js'

export const getProfilesDataSchema = {
    params:Joi.object({
        userId:generalValidationRules.dbId
    }),
    headers:generalValidationRules.headersRule.append({
        token:Joi.string().required()
    })
}

export const deleteUserSchema = {
    params:Joi.object({
        userId:generalValidationRules.dbId
    }),
    headers:generalValidationRules.headersRule.append({
        token:Joi.string().required()
    })
}

export const updateUserSchema = {
    params:Joi.object({
        userId:generalValidationRules.dbId
    }),
    headers:generalValidationRules.headersRule.append({
        token:Joi.string().required()
    }),
    body:Joi.object({
        username:Joi.string(),
        email:Joi.string().email(),
        phoneNumbers:Joi.array().items(Joi.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/)),
        addresses:Joi.array().items(Joi.string()),
        age:Joi.number().integer()
    }),
}