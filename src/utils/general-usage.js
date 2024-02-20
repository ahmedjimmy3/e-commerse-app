import Joi from 'joi'
import {Types} from 'mongoose'

const objectIdValidation = (value,helper)=>{
    const isValid = Types.ObjectId.isValid(value)
    return (isValid ? value : helper.message('Invalid ObjectId'))
}

export const generalValidationRules = {
    dbId: Joi.string().custom(objectIdValidation)
}