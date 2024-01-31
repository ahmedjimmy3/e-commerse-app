import { Router } from "express";
import * as categoryController from './category.controller.js'
import asyncWrapper from '../../utils/async-wrapper.js'
import auth from "../../middlewares/auth.middleware.js";
import multerMiddleware from "../../middlewares/multer-middleware.js";
import allowedExtensions from "../../utils/allowed-extensions.js";
import endPointsRoles from "./category-endpoints.js";

const router = Router();


router.post('/', 
    asyncWrapper(auth(endPointsRoles.ADD_CATEGORY)),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).single('image'),
    asyncWrapper(categoryController.addCategory)
)

router.put('/:categoryId', 
    asyncWrapper(auth(endPointsRoles.ADD_CATEGORY)),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).single('image'),
    asyncWrapper(categoryController.updateCategory)
)

router.get('/',
    asyncWrapper(categoryController.getAllCategories)
)

router.delete('/:categoryId',
    asyncWrapper(auth(endPointsRoles.ADD_CATEGORY)),
    asyncWrapper(categoryController.deleteCategory)
)

export default router