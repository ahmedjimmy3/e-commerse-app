import User from '../../../db/models/user.model.js'
import * as authServices from './auth.services.js'


export const signUp = async(req,res,next)=>{
    const {username,email,password,phoneNumbers,addresses,age} = req.body
    const createdUser = await authServices.createUserFunction({
            username,email,password,phoneNumbers,addresses,age
        },
        req
    )
    res.status(201).json(createdUser)
}

export const verifyEmail = async(req,res,next)=>{
    const {token} = req.query
    await authServices.verifyEmailFunction(token)
    res.status(200).json({message:"Email verification is done successfully.."})
}

export const logIn = async(req,res,next)=>{
    const {email,password} = req.body
    const token = await authServices.logInFunction(email,password)
    res.status(200).json({message:'Logged in successfully',token})
}

export const loginWithGmail = async(req,res,next)=>{
    const {idToken} = req.body
    const token = await authServices.loginWithGmailFunction(idToken)
    res.status(200).json({message:'You logged in successfully',data:token})
}

export const signUpWithGmail = async(req,res,next)=>{
    const {idToken} = req.body
    const newUser = await authServices.signUpWithGmailFunction(idToken)
    res.status(201).json({
        message:'User created successfully',
        data:newUser
    })
}