import {Router} from 'express'
import asyncWrapper from '../../utils/async-wrapper.js'
import * as orderController from './order.controller.js'
import auth from '../../middlewares/auth.middleware.js'
import endPointsRoles from './order-endpoints.js'

const router = Router()

router.post('/',
    asyncWrapper(auth(endPointsRoles.MAKE_ORDER)),
    asyncWrapper(orderController.createOrder)
)
router.post('/cartToOrder',
    asyncWrapper(auth(endPointsRoles.MAKE_ORDER)),
    asyncWrapper(orderController.convertCartToOrder)
)
router.put('/:orderId',
    asyncWrapper(auth(endPointsRoles.DELIVERED_ORDER)),
    asyncWrapper(orderController.orderDelivered)
)

export default router