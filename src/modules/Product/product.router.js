import {Router} from 'express';
import * as productController from './product.controller.js'
import asyncWrapper from '../../utils/async-wrapper.js'
import auth from '../../middlewares/auth.middleware.js';
import endpointRoles from './product-endpoints.js';
import multerMiddleware from '../../middlewares/multer-middleware.js';
import allowedExtensions from '../../utils/allowed-extensions.js';
import checkProductOwner from '../../middlewares/check-product-owner.js';
import * as productValidationSchemas from './product.validation-schemas.js'
import validationMiddleware from '../../middlewares/validation-middleware.js'

const router = Router()

router.post('/',
    asyncWrapper(auth(endpointRoles.GENERAL_PRODUCT)),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).array('image',3),
    asyncWrapper(validationMiddleware(productValidationSchemas.addProductSchema)),
    asyncWrapper(productController.addProduct)
)

router.put('/:productId',
    asyncWrapper(auth(endpointRoles.GENERAL_PRODUCT)),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).single('image'),
    asyncWrapper(validationMiddleware(productValidationSchemas.updateProductSchema)),
    asyncWrapper(productController.updateProduct)
)

router.get('/specificBrands',
    asyncWrapper(productController.productsForSpecificBrands)
)

router.get('/',
    asyncWrapper(productController.getAllProductsPaginated)
)

router.get('/search',
    asyncWrapper(productController.searchProduct)
)

router.get('/:productId',
    asyncWrapper(productController.getProductById)
)

router.delete('/:productId',
    asyncWrapper(validationMiddleware(productValidationSchemas.deleteProductSchema)),
    asyncWrapper(auth(endpointRoles.GENERAL_PRODUCT)),
    asyncWrapper((checkProductOwner)),
    asyncWrapper(productController.deleteProduct)
)

export default router