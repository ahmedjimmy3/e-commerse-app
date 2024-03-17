import Coupon from "../../db/models/coupon.model.js"
import CouponUsers from "../../db/models/coupons-users.model.js"
import couponStatus from "./coupon-status.js"
import {DateTime} from 'luxon'


export const couponValidation = async(couponCode, userId)=>{
    // coupon code valid or not
    const coupon = await Coupon.findOne({couponCode})
    if(!coupon){
        return {message:'CouponCode is not valid',status:400}
    }
    // coupon status check
    if((coupon.couponStatus == couponStatus.EXPIRED) || (DateTime.fromISO(coupon.toDate) < DateTime.now())){
        return {message:'Coupon is expired', status:400}
    }
    // fromDate check is valid
    if(DateTime.fromISO(coupon.fromDate) > DateTime.now()){
        return {message:'Coupon not started', status:400}
    }
    // user cases => user not assigned to this coupon and if user has a maximum usage
    const userCoupon = await CouponUsers.findOne({userId, couponId:coupon._id})
    if(!userCoupon){
        return {message:'Coupon not assigned to this user', status:404}
    }
    // check if user use all usageNumber
    if(userCoupon.maxUsage == userCoupon.usageCount){
        return {message:'You have exceed the maximum usage', status:400}
    }

    return coupon
}