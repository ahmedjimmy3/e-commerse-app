import User from '../../../db/models/user.model.js'
import * as userDbMethods from './auth.repo.js'
import sendEmailService from '../services/send-email.services.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const createUserFunction = async(user,req)=>{
    const isEmailExist  = await userDbMethods.findUserByEmail(user.email)
    if(isEmailExist){
        throw({message:'This email already used',cause:409})
    }
    const userToken = jwt.sign({email:user.email} , process.env.JWT_SECRET_VERIFICATION,{expiresIn:"60s"})
    const isEmailSent = await sendEmailService({
        to:user.email,
        subject:'Email verification',
        message:`
            <h2>Please click on this link to verify account</h2>
            <a href="${req.protocol}://${req.headers.host}/auth/verify-email?token=${userToken}">Verify Email</a>`,
    })
    if(!isEmailSent){
        throw({message:'Could not sent this email',cause:500})
    }
    const hashedPassword = bcrypt.hashSync(user.password,+process.env.SALT_ROUNDS)
    user.password = hashedPassword
    const createdUser = await userDbMethods.createUser(user)
    if(!createdUser){
        throw({message:'Registration Failed',cause:400})
    }
    return createdUser
}

export const verifyEmailFunction = async(token)=>{
    if(!token){
        throw({message:'Invalid token',cause:400})
    }
    const payload = jwt.verify(token , process.env.JWT_SECRET_VERIFICATION)
    const user = await User.findOne({email:payload.email , isEmailVerified:false})
    if(!user){
        throw({message:'User not found',cause:404})
    }
    user.isEmailVerified = true
    await user.save()
    return user
}

export const logInFunction = async(email,password)=>{
    const isUserExist = await userDbMethods.findUserByEmail(email)
    if(!isUserExist){
        throw({message:'Invalid credentials',cause:400})
    }
    if(!isUserExist.isEmailVerified){
        throw({message:'Please verify your email first',cause:400})
    }
    const isValidPassword = bcrypt.compareSync(password,isUserExist.password)
    if(!isValidPassword){
        throw({message:'Invalid credentials',cause:400})
    }
    const token = jwt.sign({id:isUserExist._id,email:isUserExist.email,loggedIn:true} , process.env.JWT_SECRET_KEY)
    isUserExist.isLoggedIn = true
    await isUserExist.save()
    return token
}