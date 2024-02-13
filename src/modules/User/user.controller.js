import Category from "../../../db/models/category.model.js";
import User from "../../../db/models/user.model.js";
import SubCategory from '../../../db/models/sub-category.model.js'
import Brand from '../../../db/models/brand.model.js'
import Product from '../../../db/models/product.model.js'
import cloudinary from "../../utils/cloduinary.js";
import sendEmailService from "../services/send-email.services.js";
import jwt from 'jsonwebtoken'
import systemRoles from "../../utils/system-roles.js";

export const profileData = async(req,res,next)=>{
    const {userId} = req.params
    const data = await User.findById(userId)
    .select('-_id -password -role -isEmailVerified')
    res.status(200).json({message:'Profile data', data})
}

export const deleteUser = async(req,res,next)=>{
    const {userId} = req.params
    const {_id,role} = req.authUser
    if(role == systemRoles.SUPER_ADMIN || role == systemRoles.USER){
        const deleteUser = await User.findByIdAndDelete(userId)
        if(!deleteUser){return next(new Error('Deletion Failed',{cause:400}))}
        return res.status(200).json({message:'User Deleted successfully'})
    }
    if(role == systemRoles.ADMIN){
        const subCategories = await SubCategory.find({addedBy:_id})
        if(subCategories.length){
            for (const subCategory of subCategories) {
                const subCategoryId = subCategory._id
                const folderPath = subCategory.Image.public_id.split(`${subCategory.folderId}/`)[0]
                await cloudinary.api.delete_resources_by_prefix(folderPath)
                await cloudinary.api.delete_folder(folderPath)
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
                await cloudinary.api.delete_resources_by_prefix(folderPath)
                await cloudinary.api.delete_folder(folderPath)
                const deleteProducts = await Product.deleteMany({brandId})
                if(deleteProducts.deletedCount){console.log('No Products')}
            }
            const deleteAllBrands = await Brand.deleteMany({addedBy:_id})
            if(deleteAllBrands.deletedCount){console.log('No Brands')}
        }
        const products = await Product.find({addedBy:_id})
        if(products.length){
            for (const product of products) {
                const folderPath = product.Images[0].public_id.split(`${product.folderId}/`)[0]
                await cloudinary.api.delete_resources_by_prefix(folderPath)
                await cloudinary.api.delete_folder(folderPath)
            }
            const deleteAllProducts = await Product.deleteMany({addedBy:_id})
            if(deleteAllProducts.deletedCount){console.log('No Products')}
        }
    }
    const deleteUser = await User.findByIdAndDelete(userId)
    if(!deleteUser){return next(new Error('Deletion Failed',{cause:400}))}
    res.status(200).json({message:'User Deleted successfully'})
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