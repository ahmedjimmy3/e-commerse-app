import { Schema, model } from "mongoose";

const cartSchema = new Schema(
    {
        userId:{
            type: Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        products:[
            {
                productId:{
                    type:Schema.Types.ObjectId,
                    ref:'Product',
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true,
                    default:1
                },
                basePrice:{
                    type:Number,
                    required:true,
                    default:0
                },
                finalPrice:{  //basePrice * quantity
                    type:Number,
                    required:true,
                },
                title:{
                    type:String,
                    required:true
                },
            }
        ],
        subTotal:{
            type:Number,
            required:true,
            default:0
        }
    },
    {
        timestamps:true,
        toJSON: {virtuals:true},
        toObject: {virtuals:true}
    }
)

const Cart = model('Cart',cartSchema)
export default Cart