import {Router} from 'express';
import * as productController from './product.controller.js'
import asyncWrapper from '../../utils/async-wrapper.js'
import auth from '../../middlewares/auth.middleware.js';
import endpointRoles from './product-endpoints.js';
import multerMiddleware from '../../middlewares/multer-middleware.js';
import allowedExtensions from '../../utils/allowed-extensions.js';

const router = Router()

router.post('/',
    asyncWrapper(auth(endpointRoles.ADD_PRODUCT)),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).array('image',3),
    asyncWrapper(productController.addProduct)
)

export default router