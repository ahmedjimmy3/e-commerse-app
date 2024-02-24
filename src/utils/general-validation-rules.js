import Joi from 'joi'
import { Types } from 'mongoose'

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
    })
}

export default generalValidationRules