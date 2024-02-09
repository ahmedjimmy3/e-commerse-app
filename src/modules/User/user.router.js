import { Router } from "express";
import * as userController from './user.controller.js'
import asyncWrapper from "../../utils/async-wrapper.js";
import auth from "../../middlewares/auth.middleware.js";
import checkOwnerAccount from '../../middlewares/check-owner-account.middleware.js'
import endpointRoles from "./user-endpoints.js";

const router = Router();

router.get('/:userId',
    asyncWrapper(auth(endpointRoles.GENERAL_USAGE)),
    asyncWrapper(checkOwnerAccount),
    asyncWrapper(userController.profileData)
)

router.delete('/:userId',
    asyncWrapper(auth(endpointRoles.GENERAL_USAGE)),
    asyncWrapper(checkOwnerAccount),
    asyncWrapper(userController.deleteUser)
)

router.put('/:userId',
    asyncWrapper(auth(endpointRoles.GENERAL_USAGE)),
    asyncWrapper(checkOwnerAccount),
    asyncWrapper(userController.updateUser)
)

export default router