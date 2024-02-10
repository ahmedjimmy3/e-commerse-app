import { Router } from "express";
import * as brandController from './brand.controller.js'
import asyncWrapper from '../../utils/async-wrapper.js'
import auth from "../../middlewares/auth.middleware.js";
import multerMiddleware from "../../middlewares/multer-middleware.js";
import allowedExtensions from "../../utils/allowed-extensions.js";
import endPointsRoles from "./brand-endpoints.js";

const router = Router({caseSensitive:true});


router.post('/', 
    asyncWrapper(auth(endPointsRoles.ADD_BRAND)),
    multerMiddleware({extension:allowedExtensions.IMAGE_FORMAT}).single('image'),
    asyncWrapper(brandController.addBrand)
)

router.get('/',
    asyncWrapper(brandController.allBrands)
)


export default router