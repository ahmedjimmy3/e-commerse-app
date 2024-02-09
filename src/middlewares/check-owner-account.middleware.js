import User from "../../db/models/user.model.js";

const checkOwnerAccount = async(req,res,next)=>{
    const {userId} = req.params
    const loggedInId = req.authUser._id
    const userCheck = await User.findById(userId)
    if(!userCheck){return next(new Error('This account not found',{cause:404}))}
    if(userCheck._id.toString() != loggedInId.toString()){
        return next(new Error('You are not auth to make this actions',{cause:401}))
    }
    next()
}

export default checkOwnerAccount