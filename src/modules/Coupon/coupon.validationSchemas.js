import Joi from "joi";
import generalValidationRules from "../../utils/general-validation-rules.js";

export const addCouponSchema ={
    body:Joi.object({
        couponCode: Joi.string().required().min(2).max(10).alphanum(),
        couponAmount: Joi.number().required().min(1),
        isFixed:Joi.boolean(),
        isPercentage:Joi.boolean(),
        fromDate:Joi.date().greater( Date.now() - (24*60*60*1000) ).required(),
        toDate:Joi.date().greater(Joi.ref('fromDate')).required(),
        users:Joi.array().items(
            Joi.object({
                userId: generalValidationRules.dbId.required(),
                maxUsage: Joi.number().required().min(1)
            })
        )
    }),
    headers:generalValidationRules.headersRule.append({token:Joi.string().required()})
}