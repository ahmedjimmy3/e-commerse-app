import User from '../../../db/models/user.model.js'

export const findUserById = async(userId)=>{
    return await User.findById(userId).select('-password -role -isEmailVerified')
}

export const deleteUserById = async(userId)=>{
    return await User.findByIdAndDelete(userId)
}

export const findUserByEmail = async(email)=>{
    return await User.findOne({email})
}