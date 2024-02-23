import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../../../db/models/user.model.js'
import sendEmailService from '../services/send-email.services.js'

export const signUp = async(req,res,next)=>{
    // destructure data from body
    const {username,email,password,phoneNumbers,addresses,age} = req.body
    // check if email exists
    const isEmailExist  = await User.findOne({email})
    if(isEmailExist){return next(new Error('This email already used',{cause:409}))}
    const userToken = jwt.sign({email} , process.env.JWT_SECRET_VERIFICATION,{expiresIn:"30s"})
    // send email
    const isEmailSent = await sendEmailService({
        to:email,
        subject:'Email verification',
        message:`
            <h2>Please click on this link to verify account</h2>
            <a href="${req.protocol}://${req.headers.host}/auth/verify-email?token=${userToken}">Verify Email</a>`,
    })
    if(!isEmailSent){
        return next(new Error('Could not send email',{cause:500}))
    }
    // hash password
    const hashedPassword = bcrypt.hashSync(password,+process.env.SALT_ROUNDS)
    // create new document
    const newUser = {
        username,email,password:hashedPassword,phoneNumbers,addresses,age
    }
    const createdUser = await User.create(newUser)
    // send response
    res.status(201).json(createdUser)
}

export const verifyEmail = async(req,res,next)=>{
    const {token} = req.query
    if(!token){
        return next(new Error('Invalid token',{cause:400}))
    }
    const payload = jwt.verify(token , process.env.JWT_SECRET_VERIFICATION)
    const user = await User.findOne({email:payload.email , isEmailVerified:false})
    if(!user){
        return next(new Error('User not found',{cause:404}))
    }
    user.isEmailVerified = true
    await user.save()
    res.status(200).json({message:"Email verification is done successfully.."})
}

export const logIn = async(req,res,next)=>{
    const {email,password} = req.body
    // find user by email
    const isUserExist = await User.findOne({email})
    if(!isUserExist){return next(new Error('Invalid credentials',{cause:400}))}
    // check if email is verified
    if(!isUserExist.isEmailVerified){return next(new Error('Please verify your email first',{cause:400}))}
    // compare password
    const isValidPassword = bcrypt.compareSync(password,isUserExist.password)
    if(!isValidPassword){return next(new Error('Invalid credentials',{cause:409}))}
    // generate token
    const token = jwt.sign({id:isUserExist._id,email:isUserExist.email,loggedIn:true} , process.env.JWT_SECRET_KEY)
    // change loggedIn to true
    isUserExist.isLoggedIn = true
    await isUserExist.save()
    // send response    
    res.status(200).json({message:'Logged in successfully',token})
}