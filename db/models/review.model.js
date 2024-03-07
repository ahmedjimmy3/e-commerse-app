import { Schema,model } from "mongoose";

const reviewSchema = new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        productId:{
            type:Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        reviewRate:{
            type:Number,
            required:true,
            default:0,
            min:1,
            max:5
        },
        reviewComment:{type:String}
    },
    {
        timestamps:true,
        toObject:{virtuals:true},
        toJSON:{virtuals:true}
    }
)

const Review = model('Review',reviewSchema)
export default Review