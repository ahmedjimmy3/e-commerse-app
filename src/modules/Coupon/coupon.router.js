import { Router } from "express"
import * as CouponController from './coupon.controller.js'
import asyncWrapper from "../../utils/async-wrapper.js"
import auth from "../../middlewares/auth.middleware.js"
import endPointsRoles from "./coupon-endpoints.js"
import validationMiddleware from "../../middlewares/validation-middleware.js"
import * as validators from './coupon.validationSchemas.js'

const router = Router()

router.post('/',
    asyncWrapper(auth(endPointsRoles.ADMIN_SUPER_ADMIN)),
    asyncWrapper(validationMiddleware(validators.addCouponSchema)),
    asyncWrapper(CouponController.addCoupon)
)

router.post('/valid',
    asyncWrapper(auth(endPointsRoles.ADMIN_SUPER_ADMIN)),
    asyncWrapper(CouponController.validateCoupon)
)

export default router