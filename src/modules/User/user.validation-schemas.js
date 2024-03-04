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

export const forgetPasswordSchema = {
    body:Joi.object({
        email:Joi.string().email().required()
    })
}

export const resetPasswordSchema = {
    body:Joi.object({
        password:Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        OTPCode:Joi.string().required().max(6)
    }),
    query:Joi.object({
        token:Joi.string().required()
    })
}