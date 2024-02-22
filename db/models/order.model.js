import { Schema, model } from "mongoose";
import paymentMethods from "../../src/utils/payment-Methods.js";
import ordersStatus from '../../src/utils/order-status.js'

const orderSchema = new Schema(
    {
        user: {type:Schema.Types.ObjectId,ref:'User',required:true},
        orderItems: [{
            title:{type:String , required:true},
            quantity:{type:Number,required:true},
            price:{type:Number, required:true},
            product:{type:Schema.Types.ObjectId,ref:'Product',required:true}
        }],
        shippingAddress:{
            address:{type:String,required:true},
            city:{type:String,required:true},
            postalCode:{type:String,required:true},
            country:{type:String,required:true}
        },
        phoneNumbers:[{type:String,required:true}],
        shippingPrice:{type:Number,required:true}, //array of subTotals
        coupon:{type:Schema.Types.ObjectId,ref:'Coupon'},
        totalPrice:{type:Number,required:true}, //shippingPrice - coupon
        paymentMethod:{type:String,enum:Object.values(paymentMethods),required:true},
        orderStatus:{type:String,enum:Object.values(ordersStatus),required:true,default: ordersStatus.PENDING},
        isPaid:{type:Boolean, required:true,default:false},
        paidAt:{type:String},
        isDelivered:{type:Boolean,default:false,required:true},
        deliveredAt:{type:String},
        deliveredBy:{type:Schema.Types.ObjectId,ref:'User'},
        cancelledAt:{type:String},
        cancelledBy:{type:Schema.Types.ObjectId,ref:'User'}
    },
    {timestamps:true}
)

const Order = model('Order',orderSchema)
export default Order