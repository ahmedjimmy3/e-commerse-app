import Order from "../../db/models/order.model.js"

const checkOwnerOfOrder = async(req,res,next)=>{
    const {orderId} = req.params
    const {_id}= req.authUser

    const order = await Order.findById(orderId)
    if(order.user.toString() !== _id.toString()){
        return next(new Error('You can not access this order',{cause:400}))
    }
    next()
}

export default checkOwnerOfOrder