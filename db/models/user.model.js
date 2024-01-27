import { Schema , model } from "mongoose";
import systemRoles from "../../src/utils/system-roles.js";

const userSchema = new Schema(
    {
        username:{type:String,required:true,trim:true,lowercase:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        phoneNumbers:[{type:String,required:true}],
        addresses:[{type:String,required:true}],
        role:{type:String,enum:[systemRoles.ADMIN,systemRoles.USER,systemRoles.SUPER_ADMIN],default:systemRoles.USER},
        isEmailVerified:{type:Boolean,default:false},
        age:{type:Number},
        isLoggedIn:{type:Boolean,default:false}
    },
    {
        timestamps:true,
        toObject:true,
        toJSON:true
    }
)

const User = model('User',userSchema)
export default User