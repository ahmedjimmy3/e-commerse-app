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

export const forgetPassword = async(req,res,next)=>{
    const {email} = req.body
    const OTPCode = await userServices.forgetPasswordFunction(email,req)
    res.status(200).json({message:'Please check your email to reset-password !',OTPCode})
}

export const resetPassword = async(req,res,next)=>{
    const {token} = req.query
    const {password,OTPCode} = req.body
    await userServices.resetPasswordFunction(token,OTPCode,password)
    res.status(200).json({message:'Password Reset Successfully...'})
}

export const updatePassword = async(req,res,next)=>{
    const {userId} = req.params
    const {oldPassword,newPassword} = req.body
    await userServices.updatePasswordFunction(userId,oldPassword,newPassword)
    res.status(200).json({message:'Password updated successfully'})
}