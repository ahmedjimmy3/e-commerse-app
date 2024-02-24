import Joi from 'joi'
import generalValidationRules from '../../utils/general-validation-rules.js'

export const SignUpSchema = {
    body:Joi.object({
        username:Joi.string().required(),
        email:Joi.string().email().required(),
        password:Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        phoneNumbers:Joi.array().items(Joi.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/)).required(),
        addresses:Joi.array().items(Joi.string()).required(),
        age:Joi.number().integer().required()
    }),
    headers:generalValidationRules.headersRule
}

export const LoginSchema = {
    body:Joi.object({
        email:Joi.string().email().required(), 
        password:Joi.string().required()
    }),
    headers:generalValidationRules.headersRule
}

export const verifyEmailSchema = {
    query:Joi.object({
        token:Joi.string().required()
    }),
    headers:generalValidationRules.headersRule
}