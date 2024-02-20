import { Schema, model } from "mongoose";
import couponStatus from "../../src/utils/coupon-status.js";

const couponSchema = new Schema(
    {
        couponCode:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
            unique:true
        },
        couponAmount:{
            type:Number,
            required:true,
            min:1
        },
        couponStatus:{
            type:String,
            default: couponStatus.ACTIVE,
            enum: [couponStatus.ACTIVE, couponStatus.EXPIRED]
        },
        isFixed:{
            type:Boolean,
            default:false,
        },
        isPercentage:{
            type:Boolean,
            default:false
        },
        fromDate:{
            type:String,
            required:true
        },
        toDate:{
            type:String,
            required:true
        },
        addedBy:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        updatedBy:{
            type:Schema.Types.ObjectId,
            ref:'User',
        }
    },
    {timestamps:true}
)

const Coupon = model('Coupon', couponSchema)
export default Coupon