import Review from "../../db/models/review.model.js";

const checkReviewOwner = async(req,res,next)=>{
    const {reviewId,productId} = req.params
    const {_id:userId} = req.authUser
    const review = await Review.findOne({_id:reviewId,productId})
    if(!review){return next(new Error('Review not found',{cause:404}))}
    if(review.userId.toString() !== userId.toString()){
        return next(new Error('You are not authorized to make this action',{cause:401}))
    }
    next()
}

export default checkReviewOwner