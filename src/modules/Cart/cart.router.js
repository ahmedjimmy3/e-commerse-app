import { Router } from "express";
import asyncWrapper from '../../utils/async-wrapper.js'
import * as cartController from './cart.controller.js'
import auth from '../../middlewares/auth.middleware.js'
import endpointRoles from "./cart-endpoints.js";

const router = Router()

router.post('/',
    asyncWrapper(auth(endpointRoles.ADD_PRODUCT_TO_CART)),
    asyncWrapper(cartController.addProductToCart)
)

router.put('/:productId',
    asyncWrapper(auth(endpointRoles.ADD_PRODUCT_TO_CART)),
    asyncWrapper(cartController.removeFromCart)
)

export default router