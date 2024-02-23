import { Schema , model} from "mongoose";

const couponUsersSchema = Schema(
    {
        couponId:{
            type:Schema.Types.ObjectId,
            ref:'Coupon',
            // required:true
        },
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            // required:true
        },
        maxUsage:{
            type:Number,
            required:true,
            min:1
        },
        usageCount:{
            type:Number,
            default:0
        }
    },
    {timestamps:true}
)

couponUsersSchema.index({couponId:1,userId:1},{unique:true})

couponUsersSchema.pre('validate',function(next){
    if(!this.couponId || !this.userId){
        throw new Error('couponId required')
    }
    next()
})

const CouponUsers = model('CouponUser',couponUsersSchema)
export default CouponUsers