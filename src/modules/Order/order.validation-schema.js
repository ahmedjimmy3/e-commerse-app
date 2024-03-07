import Joi from 'joi'
import generalValidationRules from '../../utils/general-validation-rules.js'

export const makeOrderSchema = {
    body:generalValidationRules.makeOrder.required().append({
        quantity:Joi.number().integer().min(1).required(),
        product: generalValidationRules.dbId.required()
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}

export const convertCartToOrderSchema = {
    body:generalValidationRules.makeOrder.required(),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}

export const deliveryOrderSchema = {
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()}),
    params:Joi.object({
        orderId:generalValidationRules.dbId.required()
    })
}

export const cancelOrderSchema = {
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()}),
    params:Joi.object({
        orderId:generalValidationRules.dbId.required()
    })
}