import Coupon from "../../../db/models/coupon.model.js"
import CouponUsers from "../../../db/models/coupons-users.model.js"
import User from "../../../db/models/user.model.js"

export const addCoupon = async(req,res,next)=>{
    const {couponCode,couponAmount,fromDate,toDate,isFixed,isPercentage,users} = req.body
    const {_id: addedBy} = req.authUser
    
    const isCouponCodeExist = await Coupon.findOne({couponCode})
    if(isCouponCodeExist){return next(new Error('CouponCode is already exist',{cause:409}))}

    if(isFixed == isPercentage){return next(new Error('Coupon can be either fixed or percentage',{cause:400}))}

    if(isPercentage){
        if(couponAmount>100) {
            return next(new Error('Percentage must me less than 100'))
        }
    }

    const couponObj = {
        couponCode,
        couponAmount,
        fromDate,
        toDate,
        isFixed,
        isPercentage,
        addedBy
    }

    const coupon = await Coupon.create(couponObj)

    const userIds = []
    for (const user of users) {
        userIds.push(user.userId)
    }
    const isFound = await User.find({_id:{$in:userIds}})
    if(!isFound.length != users.length){
        return next(new Error('User not found',{cause:404}))
    }

    const couponUsers = await CouponUsers.create(
        users.map(ele => ({...ele,couponId:coupon._id}))
    )

    res.status(201).json({message:'Coupon created done', data: coupon, couponUsers})
}