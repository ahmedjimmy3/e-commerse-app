import { Router } from "express";
import * as brandController from './brand.controller.js'
import asyncWrapper from '../../utils/async-wrapper.js'
import auth from "../../middlewares/auth.middleware.js";
import multerMiddleware from "../../middlewares/multer-middleware.js";
import allowedExtensions from "../../utils/allowed-extensions.js";
import endPointsRoles from "./brand-endpoints.js";
import checkOwnerBrand from '../../middlewares/check-owner-brand.middleware.js'
import checkOwnerORSuperAdmin from '../../middlewares/check-owner-or-super-admin.middleware.js'
import * as brandValidationSchemas from './brands.validation-schemas.js'
import validationMiddleware from '../../middlewares/validation-middleware.js'

const router = Router({caseSensitive:true});


router.post('/', 
    asyncWrapper(auth(endPointsRoles.GENERAL_BRAND)),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).single('image'),
    asyncWrapper(validationMiddleware(brandValidationSchemas.addBrandSchema)),
    asyncWrapper(brandController.addBrand)
)

router.get('/',
    asyncWrapper(brandController.allBrands)
)

router.get('/specificSub-Category',
    asyncWrapper(validationMiddleware(brandValidationSchemas.getBrandsToSpecificSubCategorySchema)),
    asyncWrapper(brandController.allBrandsToSpecificSubCategory)
)

router.get('/specificCategory',
    asyncWrapper(validationMiddleware(brandValidationSchemas.getBrandsToSpecificCategorySchema)),
    asyncWrapper(brandController.allBrandsToSpecificCategory)
)

router.put('/:brandId',
    asyncWrapper(auth(endPointsRoles.GENERAL_BRAND)),
    asyncWrapper(checkOwnerBrand),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).single('image'),
    asyncWrapper(validationMiddleware(brandValidationSchemas.updateBrandSchema)),
    asyncWrapper(brandController.updateBrand)
)

router.delete('/:brandId',
    asyncWrapper(validationMiddleware(brandValidationSchemas.deleteBrandSchema)),
    asyncWrapper(auth(endPointsRoles.ADMIN_SUPER_ADMIN)),
    asyncWrapper(checkOwnerORSuperAdmin),
    asyncWrapper(brandController.deleteBrand)
)

export default router