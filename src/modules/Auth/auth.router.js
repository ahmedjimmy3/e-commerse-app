import { Router } from "express";
import * as authController from './auth.controller.js'
import asyncWrapper from '../../utils/async-wrapper.js'

const router = Router();

router.post('/signup' ,
    asyncWrapper(authController.signUp)
)
router.get('/verify-email',
    asyncWrapper(authController.verifyEmail)
)

router.post('/login',
    asyncWrapper(authController.logIn)
)


export default router