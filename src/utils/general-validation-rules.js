import Joi from 'joi'
import { Types } from 'mongoose'
import paymentMethods from './payment-Methods.js'

const checkValidId = (value,helper)=>{
    const isValid = Types.ObjectId.isValid(value)
    return (isValid ? value : helper.message('Invalid ObjectId format'))
}

const generalValidationRules = {
    dbId: Joi.string().custom(checkValidId),
    headersRule:Joi.object({
        'user-agent': Joi.string().required(),
        accept: Joi.string(),
        'cache-control': Joi.string(),
        'postman-token':Joi.string(),
        'accept-encoding': Joi.string(),
        host: Joi.string(),
        connection: Joi.string(),
        'content-type':Joi.string(),
        'content-length':Joi.string(),
    }),
    makeOrder:Joi.object({
        paymentMethod:Joi.string().required().valid(paymentMethods.CASH,paymentMethods.PAYMOB,paymentMethods.STRIPE),
        couponCode:Joi.string(),
        phoneNumbers:Joi.array().items(Joi.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/)).required(),
        address:Joi.string().required(),
        country:Joi.string().required(),
        postalCode:Joi.string().required().max(4),
        city:Joi.string().required()
    }),
}

export default generalValidationRules