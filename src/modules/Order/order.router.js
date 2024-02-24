import {Router} from 'express'
import asyncWrapper from '../../utils/async-wrapper.js'
import * as orderController from './order.controller.js'
import auth from '../../middlewares/auth.middleware.js'
import endPointsRoles from './order-endpoints.js'
import validationMiddleware from '../../middlewares/validation-middleware.js'
import * as orderValidationSchemas from './order.validation-schema.js'

const router = Router()

router.post('/',
    asyncWrapper(validationMiddleware(orderValidationSchemas.makeOrderSchema)),
    asyncWrapper(auth(endPointsRoles.MAKE_ORDER)),
    asyncWrapper(orderController.createOrder)
)
router.post('/cartToOrder',
    asyncWrapper(validationMiddleware(orderValidationSchemas.convertCartToOrderSchema)),
    asyncWrapper(auth(endPointsRoles.MAKE_ORDER)),
    asyncWrapper(orderController.convertCartToOrder)
)
router.put('/:orderId',
    asyncWrapper(validationMiddleware(orderValidationSchemas.deliveryOrderSchema)),    
    asyncWrapper(auth(endPointsRoles.DELIVERED_ORDER)),
    asyncWrapper(orderController.orderDelivered)
)

export default router