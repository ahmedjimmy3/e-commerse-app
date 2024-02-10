import { Router } from "express";
import * as subCategoryController from './sub-category.controller.js'
import asyncWrapper from '../../utils/async-wrapper.js'
import auth from "../../middlewares/auth.middleware.js";
import multerMiddleware from "../../middlewares/multer-middleware.js";
import allowedExtensions from "../../utils/allowed-extensions.js";
import endPointsRoles from "./sub-category-endpoints.js";

const router = Router();


router.post('/:categoryId', 
    asyncWrapper(auth(endPointsRoles.GENERAL_SUB_CATEGORY)),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).single('image'),
    asyncWrapper(subCategoryController.addSubCategory)
)

router.get('/',
    asyncWrapper(subCategoryController.allSubCategories)
)

router.put('/:subCategoryId',
    asyncWrapper(auth(endPointsRoles.GENERAL_SUB_CATEGORY)),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).single('image'),
    asyncWrapper(subCategoryController.updateSubCategory)
)

router.delete('/:subCategoryId',
    asyncWrapper(auth(endPointsRoles.GENERAL_SUB_CATEGORY)),
    asyncWrapper(subCategoryController.deleteSubCategory)
)

export default router