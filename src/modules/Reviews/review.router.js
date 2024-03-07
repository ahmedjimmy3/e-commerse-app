import { Router } from "express";
import * as reviewController from './review.controller.js'
import asyncWrapper from '../../utils/async-wrapper.js'
import validationMiddleware from '../../middlewares/validation-middleware.js'
import endPointsRoles from './review.endpoints.js'
import auth from '../../middlewares/auth.middleware.js'
import * as reviewValidationSchemas from './review.validation-schemas.js'
import checkReviewOwner from '../../middlewares/check-review-owner.js'

const router = Router()

router.post('/',
    asyncWrapper(auth(endPointsRoles.GENERAL_REVIEW)),
    asyncWrapper(validationMiddleware(reviewValidationSchemas.addReviewSchema)),
    asyncWrapper(reviewController.addReview)
)

router.get('/',
    asyncWrapper(validationMiddleware(reviewValidationSchemas.getAllReviewsToProductSchema)),
    asyncWrapper(reviewController.getAllReviewsToProduct)
)

router.delete('/:productId/:reviewId',
    asyncWrapper(auth(endPointsRoles.GENERAL_REVIEW)),
    asyncWrapper(checkReviewOwner),
    asyncWrapper(validationMiddleware(reviewValidationSchemas.deleteReviewSchema)),
    asyncWrapper(reviewController.deleteReview)
)

export default router;