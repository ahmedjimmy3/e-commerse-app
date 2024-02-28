import * as userServices from './user.services.js'

export const profileData = async(req,res,next)=>{
    const {userId} = req.params
    const data = await userServices.getUserDataFunction(userId)
    res.status(200).json({message:'Profile data', data})
}

export const deleteUser = async(req,res,next)=>{
    const {userId} = req.params
    const {_id,role} = req.authUser
    await userServices.deleteUserFunction(_id,role,userId)
    res.status(200).json({message:'User Deleted successfully'})
}

export const updateUser = async(req,res,next)=>{
    const {userId} = req.params
    const {username,email,phoneNumbers,addresses,age} = req.body
    const updateUser = await userServices.updateUserFunction(userId,username,email,phoneNumbers,addresses,age,req)
    res.status(200).json({message:'Updated Done',data:updateUser})
}   