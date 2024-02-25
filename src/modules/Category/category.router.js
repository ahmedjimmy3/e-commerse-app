import { Router } from "express";
import * as categoryController from './category.controller.js'
import asyncWrapper from '../../utils/async-wrapper.js'
import auth from "../../middlewares/auth.middleware.js";
import multerMiddleware from "../../middlewares/multer-middleware.js";
import allowedExtensions from "../../utils/allowed-extensions.js";
import endPointsRoles from "./category-endpoints.js";
import validationMiddleware from '../../middlewares/validation-middleware.js'
import * as categoryValidationSchemas from './category.validation-schemas.js' 

const router = Router();


router.post('/', 
    asyncWrapper(auth(endPointsRoles.ADD_CATEGORY)),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).single('image'),
    asyncWrapper(validationMiddleware(categoryValidationSchemas.addCategorySchema)),
    asyncWrapper(categoryController.addCategory)
)

router.put('/:categoryId', 
    asyncWrapper(auth(endPointsRoles.ADD_CATEGORY)),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).single('image'),
    asyncWrapper(validationMiddleware(categoryValidationSchemas.updateCategorySchema)),
    asyncWrapper(categoryController.updateCategory)
)

router.get('/',
    asyncWrapper(categoryController.getAllCategories)
)

router.delete('/:categoryId',
    asyncWrapper(validationMiddleware(categoryValidationSchemas.deleteCategorySchema)),
    asyncWrapper(auth(endPointsRoles.ADD_CATEGORY)),
    asyncWrapper(categoryController.deleteCategory)
)

export default router