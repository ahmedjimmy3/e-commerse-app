import {scheduleJob} from 'node-schedule'
import Coupon from '../../db/models/coupon.model.js'
import moment from 'moment'
import couponStatus from './coupon-status.js'
import {DateTime} from 'luxon'

function cronToChangeExpiredCoupons(){
    scheduleJob('*/2 * * * * *', async function(){
        console.log('check expiration')
        const coupons = await Coupon.find({couponStatus: couponStatus.ACTIVE})
        for (const coupon of coupons) {
            // if(moment().isAfter(moment(coupon.toDate))){
            //     coupon.couponStatus = couponStatus.EXPIRED
            // }
            if(DateTime.fromISO(coupon.toDate) < DateTime.now()){
                coupon.couponStatus = couponStatus.EXPIRED
            }
            await coupon.save()
        }
    })
}

export default cronToChangeExpiredCoupons