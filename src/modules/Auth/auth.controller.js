import User from '../../../db/models/user.model.js'
import * as authServices from './auth.services.js'
import {OAuth2Client} from 'google-auth-library'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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
    const client = new OAuth2Client();
    async function verify() {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload
    }
    const result = await verify().catch(console.error);
    if(!result.email_verified){
        throw({message:'Please verify your email first',cause:400})
    }
    const isUserExist = await User.findOne({email:result.email,provider:'GOOGLE'})
    if(!isUserExist){
        throw({message:'Invalid credentials',cause:400})
    }
    const token = jwt.sign({id:isUserExist._id,email:result.email,loggedIn:true} , process.env.JWT_SECRET_KEY)
    isUserExist.isLoggedIn = true
    await isUserExist.save()
    res.status(200).json({message:'You logged in successfully',data:token})
}

export const signUpWithGmail = async(req,res,next)=>{
    const {idToken} = req.body
    const client = new OAuth2Client();
    async function verify() {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload
    }
    const result = await verify().catch(console.error);
    if(!result.email_verified){
        throw({message:'Please verify your email first',cause:400})
    }

    const isEmailExist  = await User.findOne({email:result.email})
    if(isEmailExist){
        throw({message:'This email already used',cause:409})
    }
    const randomPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = bcrypt.hashSync(randomPassword,+process.env.SALT_ROUNDS)
    const newUser = await User.create({
        username:result.name,
        email:result.email,
        password:hashedPassword,
        isEmailVerified:true,
        provider:'GOOGLE',
    })
    res.status(201).json({
        message:'User created successfully',
        data:newUser
    })
}