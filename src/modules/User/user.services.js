import User from "../../../db/models/user.model.js";
import SubCategory from '../../../db/models/sub-category.model.js'
import Brand from '../../../db/models/brand.model.js'
import Product from '../../../db/models/product.model.js'
import cloudinary from "../../utils/cloduinary.js";
import systemRoles from "../../utils/system-roles.js";
import * as userRepo from './user.repo.js'
import jwt from 'jsonwebtoken'
import sendEmailService from '../services/send-email.services.js'
import generateUniqueString from '../../utils/generate-unique-string.js'
import bcrypt from 'bcrypt'

export const getUserDataFunction =async(userId)=>{
    const data = await userRepo.findUserById(userId)
    if(!data){
        throw({message:'No data',cause:404})
    }
    return data
}

export const updateUserFunction = async(userId,username,email,phoneNumbers,addresses,age,req)=>{
    const user = await userRepo.findUserById(userId)
    if(email){
        const checkEmailExist = await userRepo.findUserByEmail(email)
        if(checkEmailExist){throw({message:'This email already used',cause:409})}
        user.isEmailVerified = false
        const userToken = jwt.sign({email} , process.env.JWT_SECRET_VERIFICATION,{expiresIn:"1d"})
        const isEmailSend = await sendEmailService({
            to:email,
            subject: 'Email verification',
            message:`
                <h2>Please click on this link to verify account</h2>
                <a href="${req.protocol}://${req.headers.host}/auth/verify-email?token=${userToken}">Verify Email</a>`,
        })
        if(!isEmailSend){throw({message:'Could not sent email',cause:500})}
        user.email = email
    }
    if(username){user.username = username}
    if(phoneNumbers){user.phoneNumbers = phoneNumbers}
    if(addresses){user.addresses = addresses}
    if(age){user.age = age}
    await user.save()
    return user
}

export const deleteUserFunction = async(_id,role,userId)=>{
    if(role == systemRoles.SUPER_ADMIN || role == systemRoles.USER){
        const deleteUser = await userRepo.deleteUserById(_id)
        if(!deleteUser){throw({message:'Deletion Failed',cause:400})}
        return deleteUser
    }
    if(role == systemRoles.ADMIN){
        const subCategories = await SubCategory.find({addedBy:_id})
        if(subCategories.length){
            for (const subCategory of subCategories) {
                const subCategoryId = subCategory._id
                const folderPath = subCategory.Image.public_id.split(`${subCategory.folderId}/`)[0]
                await cloudinary.api.delete_resources_by_prefix(folderPath+`${subCategory.folderId}`)
                await cloudinary.api.delete_folder(folderPath+`${subCategory.folderId}`)
                const deleteBrands = await Brand.deleteMany({subCategoryId})
                if(!deleteBrands.deletedCount){console.log('No Brands')}
                const deleteProducts = await Product.deleteMany({subCategoryId})
                if(deleteProducts.deletedCount){console.log('No Products')}
            }
        }
        const deleteAllSubCategories = await SubCategory.deleteMany({addedBy:_id})
        if(!deleteAllSubCategories.deletedCount){
            console.log('No Sub-categories')
        }
        const brands = await Brand.find({addedBy:_id})
        if(brands.length){
            for (const brand of brands) {
                const brandId = brand._id
                const folderPath = brand.Image.public_id.split(`${brand.folderId}/`)[0]
                await cloudinary.api.delete_resources_by_prefix(folderPath+`${brand.folderId}`)
                await cloudinary.api.delete_folder(folderPath+`${brand.folderId}`)
                const deleteProducts = await Product.deleteMany({brandId})
                if(deleteProducts.deletedCount){console.log('No Products')}
            }
            const deleteAllBrands = await Brand.deleteMany({addedBy:_id})
            if(deleteAllBrands.deletedCount){console.log('No Brands')}
        }else{console.log('No Brands')}
        const products = await Product.find({addedBy:_id})
        if(products.length){
            for (const product of products) {
                const folderPath = product.Images[0].public_id.split(`${product.folderId}/`)[0]
                await cloudinary.api.delete_resources_by_prefix(folderPath+`${product.folderId}`)
                await cloudinary.api.delete_folder(folderPath+`${product.folderId}`)
            }
            const deleteAllProducts = await Product.deleteMany({addedBy:_id})
            if(deleteAllProducts.deletedCount){console.log('No Products')}
        }else{console.log('No Products')}
    }
    const deleteUser = await User.findByIdAndDelete(userId)
    if(!deleteUser){return next(new Error('Deletion Failed',{cause:400}))}
    return deleteUser
}

export const forgetPasswordFunction = async(email,req)=>{
    const user = await userRepo.findUserByEmail(email)
    if(!user){throw({message:'This email not found',cause:404})}
    if(!user.isEmailVerified){throw({message:'Please verify your email',cause:400})}
    if(user.isLoggedIn){throw({message:'You are already login',cause:400})}
    const userToken = jwt.sign({email} , process.env.JWT_SECRET_VERIFICATION,{expiresIn:"30s"})
    const isEmailSend = await sendEmailService({
        to:user.email,
        subject:'Forget Password',
        message:`
            <h2>Please click on this link to reset new password</h2>
            <a href="${req.protocol}://${req.headers.host}/user/set/reset-password?token=${userToken}">Reset Password</a>`,
    })
    if(!isEmailSend){throw({message:'This email was not sent',cause:500})}
    const OTPCode = generateUniqueString()
    user.OTPCode = bcrypt.hashSync(OTPCode,+process.env.SAULT_ROUNDS)
    await user.save()
    return OTPCode
}

export const resetPasswordFunction = async(token,OTPCode,newPassword)=>{
    if(!token){throw({message:'Invalid Token',cause:400})}
    const {email} = jwt.verify(token,process.env.JWT_SECRET_VERIFICATION)
    const userFound = await userRepo.findUserByEmail(email)
    if(!userFound || !userFound.OTPCode){
        throw({message:'This account does not found',cause:404})
    }
    const checkValidOTP = bcrypt.compareSync(OTPCode,userFound.OTPCode)
    if(!checkValidOTP){throw({message:'Invalid OTP',cause:400})}
    userFound.OTPCode = undefined
    userFound.password = bcrypt.hashSync(newPassword,+process.env.SAULT_ROUNDS)
    userFound.isLoggedIn = true
    await userFound.save()
    return userFound
}