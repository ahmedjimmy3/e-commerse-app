import { Router } from "express";
import * as userController from './user.controller.js'
import asyncWrapper from "../../utils/async-wrapper.js";
import auth from "../../middlewares/auth.middleware.js";
import checkOwnerAccount from '../../middlewares/check-owner-account.middleware.js'
import endpointRoles from "./user-endpoints.js";
import * as userValidationSchemas from './user.validation-schemas.js'
import validationMiddleware from '../../middlewares/validation-middleware.js'

const router = Router();

router.get('/:userId',
    asyncWrapper(validationMiddleware(userValidationSchemas.getProfilesDataSchema)),
    asyncWrapper(auth(endpointRoles.GENERAL_USAGE)),
    asyncWrapper(checkOwnerAccount),
    asyncWrapper(userController.profileData)
)

router.delete('/:userId',
    asyncWrapper(validationMiddleware(userValidationSchemas.deleteUserSchema)),
    asyncWrapper(auth(endpointRoles.GENERAL_USAGE)),
    asyncWrapper(checkOwnerAccount),
    asyncWrapper(userController.deleteUser)
)

router.put('/:userId',
    asyncWrapper(validationMiddleware(userValidationSchemas.updateUserSchema)),
    asyncWrapper(auth(endpointRoles.GENERAL_USAGE)),
    asyncWrapper(checkOwnerAccount),
    asyncWrapper(userController.updateUser)
)

router.post('/forget-pass',
    asyncWrapper(userController.forgetPassword)
)

router.put('/set/reset-password',
    asyncWrapper(userController.resetPassword)
)
export default router