import { Router } from "express";
import * as brandController from './brand.controller.js'
import asyncWrapper from '../../utils/async-wrapper.js'
import auth from "../../middlewares/auth.middleware.js";
import multerMiddleware from "../../middlewares/multer-middleware.js";
import allowedExtensions from "../../utils/allowed-extensions.js";
import endPointsRoles from "./brand-endpoints.js";
import checkOwnerBrand from '../../middlewares/check-owner-brand.middleware.js'
import checkOwnerORSuperAdmin from '../../middlewares/check-owner-or-super-admin.middleware.js'

const router = Router({caseSensitive:true});


router.post('/', 
    asyncWrapper(auth(endPointsRoles.GENERAL_BRAND)),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).single('image'),
    asyncWrapper(brandController.addBrand)
)

router.get('/',
    asyncWrapper(brandController.allBrands)
)

router.put('/:brandId',
    asyncWrapper(auth(endPointsRoles.GENERAL_BRAND)),
    asyncWrapper(checkOwnerBrand),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).single('image'),
    asyncWrapper(brandController.updateBrand)
)

router.delete('/:brandId',
    asyncWrapper(auth(endPointsRoles.ADMIN_SUPER_ADMIN)),
    asyncWrapper(checkOwnerORSuperAdmin),
    asyncWrapper(brandController.deleteBrand)
)

export default router