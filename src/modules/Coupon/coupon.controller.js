import * as couponServices from './coupon.services.js'

export const addCoupon = async(req,res,next)=>{
    const {couponCode,couponAmount,fromDate,toDate,isFixed,isPercentage,users} = req.body
    const {_id: addedBy} = req.authUser
    
    const data = await couponServices.addCouponFunction({
        couponCode,couponAmount,fromDate,toDate,isFixed,isPercentage,users,addedBy
    })

    res.status(201).json({message:'Coupon created done',data})
}

export const validateCoupon = async(req,res,next)=>{
    const {code} = req.body
    const {_id: userId} = req.authUser
    const isCouponValid = await couponServices.validateCouponFunction(code,userId)
    res.status(200).json({message:`@coupon is valid`, data:isCouponValid})
}