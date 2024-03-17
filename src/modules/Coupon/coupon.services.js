import Coupon from "../../../db/models/coupon.model.js"
import CouponUsers from "../../../db/models/coupons-users.model.js"
import User from "../../../db/models/user.model.js"
import { couponValidation } from "../../utils/apply-coupon-validation.js"

export const addCouponFunction = async({
    couponCode,couponAmount,fromDate,toDate,isFixed,isPercentage,users,addedBy
})=>{
    const isCouponCodeExist = await Coupon.findOne({couponCode})
    if(isCouponCodeExist){throw({message:'Coupon is already exist',cause:409})}

    if(isFixed == isPercentage){throw({message:'Coupon can be either fixed or percentage',cause:400})}

    if(isPercentage){
        if(couponAmount>100) {
            throw({message:'Percentage must me less than 100',cause:400})
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
    if(isFound.length != users.length){
        throw({message:'User not found',cause:404})
    }

    let arr = users.map(ele=>({...ele,couponId:coupon._id}))
    const couponUsers = await CouponUsers.create(arr)
    return {coupon,couponUsers}
}

export const validateCouponFunction = async(code,userId)=>{
    const isCouponValid = await couponValidation(code,userId)
    if(isCouponValid.status){
        throw({message:isCouponValid.message,cause:isCouponValid.status})
    }
    return isCouponValid
}