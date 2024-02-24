import { Router } from "express";
import * as authController from './auth.controller.js'
import asyncWrapper from '../../utils/async-wrapper.js'
import validationMiddleware from '../../middlewares/validation-middleware.js'
import *as authValidation from "./auth.validation-schemas.js";

const router = Router();

router.post('/signup' ,
    asyncWrapper(validationMiddleware(authValidation.SignUpSchema)),
    asyncWrapper(authController.signUp)
)
router.get('/verify-email',
    asyncWrapper(authController.verifyEmail)
)

router.post('/login',
    asyncWrapper(validationMiddleware(authValidation.LoginSchema)),
    asyncWrapper(authController.logIn)
)


export default router