import Category from "../../../db/models/category.model.js";
import User from "../../../db/models/user.model.js";
import SubCategory from '../../../db/models/sub-category.model.js'
import Brand from '../../../db/models/brand.model.js'
import Product from '../../../db/models/product.model.js'
import cloudinary from "../../utils/cloduinary.js";
import sendEmailService from "../services/send-email.services.js";
import jwt from 'jsonwebtoken'

export const profileData = async(req,res,next)=>{
    const {userId} = req.params
    const data = await User.findById(userId)
    .select('-_id -password -role -isEmailVerified')
    res.status(200).json({message:'Profile data', data})
}

export const deleteUser = async(req,res,next)=>{
    const {userId} = req.params
    const deleteUser = await User.findByIdAndDelete(userId)
    if(!deleteUser){return next(new Error('Deletion Failed',{cause:400}))}

    const categories = await Category.find({addedBy:userId})
    if(categories.length){
        for (const category of categories) {
            const folderPath = category.Image.public_id.split(`${category.folderId}/`)[0]
            await cloudinary.api.delete_resources_by_prefix(folderPath)
            await cloudinary.api.delete_folder(folderPath)
        }
        const deleteCategory = await Category.deleteMany({addedBy:userId})
        if(!deleteCategory.deletedCount){console.log('Categories not found')}
    }

    const subCategories = await SubCategory.find({addedBy:userId})
    if(subCategories.length){
        for (const subCategory of subCategories) {
            const folderPath = subCategory.Image.public_id.split(`${subCategory.folderId}/`)[0]
            await cloudinary.api.delete_resources_by_prefix(folderPath)
            await cloudinary.api.delete_folder(folderPath)
        }
        const deleteSubCategories = await SubCategory.deleteMany({addedBy:userId})
        if(!deleteSubCategories.deletedCount){console.log('SubCategories not found')}
    }

    const Brands = await SubCategory.find({addedBy:userId})
    if(Brands.length){
        for (const brand of Brands) {
            const folderPath = brand.Image.public_id.split(`${brand.folderId}/`)[0]
            await cloudinary.api.delete_resources_by_prefix(folderPath)
            await cloudinary.api.delete_folder(folderPath)
        }
        const deleteBrands = await Brand.deleteMany({addedBy:userId})
        if(!deleteBrands.deletedCount){console.log('Brands not found')}
    }

    const products = await Product.find({addedBy:userId})
    if(products.length){
        for (const product of products) {
            const folderPath = product.Images[0].public_id.split(`${product.folderId}/`)[0]
            await cloudinary.api.delete_resources_by_prefix(folderPath)
            await cloudinary.api.delete_folder(folderPath)
        }
        const deleteProducts = await Product.deleteMany({addedBy:userId})
        if(!deleteSubCategories.deletedCount){console.log('Products not found')}
    }
    
    res.status(200).json({message:'Deleted Done'})
}

export const updateUser = async(req,res,next)=>{
    const {userId} = req.params
    const {username,email,phoneNumbers,addresses,age} = req.body
    const user = await User.findById(userId)
    if(email){
        const checkEmailExist = await User.findOne({email})
        if(checkEmailExist){return next(new Error('This email already used',{cause:409}))}
        user.isEmailVerified = false
        const userToken = jwt.sign({email} , process.env.JWT_SECRET_VERIFICATION,{expiresIn:"30s"})
        const isEmailSend = sendEmailService({
            to:email,
            subject: 'Email verification',
            message:`
                <h2>Please click on this link to verify account</h2>
                <a href="http://localhost:3000/auth/verify-email?token=${userToken}">Verify Email</a>`,
        })
        if(!isEmailSend){return next(new Error('Could not sent this email'))}
    }
    if(username){user.email = email}
    if(phoneNumbers){user.phoneNumbers = phoneNumbers}
    if(addresses){user.addresses = addresses}
    if(age){user.age = age}

    await user.save()
    res.status(200).json({message:'Updated Done',updateUser})
}