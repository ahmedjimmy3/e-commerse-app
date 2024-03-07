import Review from "../../../db/models/review.model.js";
import Order from '../../../db/models/order.model.js'
import ordersStatus from "../../utils/order-status.js";
import Product from '../../../db/models/product.model.js'

export const addReview = async(req,res,next)=>{
    const {_id:userId} = req.authUser
    const {productId} = req.query
    const {reviewRate, reviewComment} = req.body
    const isProductValid = await Order.findOne({
        user:userId ,
        orderStatus:ordersStatus.DELIVERED,
        'orderItems.product':productId
    })
    if(!isProductValid){return next(new Error('You have not made any order yet',{cause:400}))}
    const reviewObj = {
        userId,
        productId,
        reviewRate,
        reviewComment
    }
    const review = await Review.create(reviewObj)
    if(!review){return next(new Error('Something went wrong',{cause:500}))}
    const product = await Product.findById(productId)
    const reviews = await Review.find({productId})
    let sumRates=0
    for (const review of reviews) {
        sumRates += review.reviewRate
    }
    const avgRating = Number(sumRates/reviews.length).toFixed(2)
    product.avgRating = avgRating
    await product.save()
    res.status(201).json({message:'Review added successfully',data:review})
}

export const getAllReviewsToProduct = async(req,res,next)=>{
    const {productId} = req.query
    const reviews = await Review.find({productId})
    if(!reviews.length){console.log('No reviews')}
    res.status(200).json({message:'These all reviews to this product',data:reviews})
}

export const deleteReview = async(req,res,next)=>{
    const {reviewId,productId} = req.params
    const reviewDeleted = await Review.findByIdAndDelete(reviewId)
    if(!reviewDeleted){return next(new Error('Deletion Failed',{cause:400}))}
    const product = await Product.findById(productId)
    const anotherReviews = await Review.find({productId})
    let sumRates=0
    for (const review of anotherReviews) {
        sumRates += review.reviewRate
    }
    product.avgRating = Number(sumRates/anotherReviews.length).toFixed(2)
    await product.save()
    res.status(200).json({message:'You review deleted done !..'})
}