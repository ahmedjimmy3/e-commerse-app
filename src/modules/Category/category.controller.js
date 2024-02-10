import Category from "../../../db/models/category.model.js"
import slugify from 'slugify'
import generateUniqueString from '../../utils/generate-unique-string.js'
import cloudinary from "../../utils/cloduinary.js"
import SubCategory from '../../../db/models/sub-category.model.js'
import Brand from '../../../db/models/brand.model.js'

export const addCategory = async(req,res,next)=>{
    const { name } = req.body
    const {_id} = req.authUser
    // check is this valid name
    const isNameDuplicate = await Category.findOne({name})
    if(isNameDuplicate){return next(new Error('This name already used',{cause:409}))}
    // slug
    const slug = slugify(name,'-')
    // upload image
    if(!req.file){
        return next(new Error('Please upload image',{cause:400}))
    }
    const folderId = generateUniqueString(6)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/Categories/${folderId}`
    })
    // new Category
    const newCategory = {
        name,
        slug,
        Image:{ secure_url , public_id },
        folderId,
        addedBy:_id
    }
    // create category
    const categoryCreated = await Category.create(newCategory)
    res.status(201).json({message:'Category created successfully',categoryCreated})
}

export const updateCategory = async(req,res,next)=>{
    const {name ,oldPublicId} = req.body
    const {categoryId} = req.params
    const {_id} = req.authUser
    // check if category exist
    const categoryFound = await Category.findById(categoryId)
    if(!categoryFound){return next(new Error('This category not found',{cause:404}))}
    // check if the user want to update name
    if(name){
        if(name == categoryFound.name){return next(new Error('Enter different name please.',{cause:400}))}
        const isNameDuplicate = await Category.findOne({name})
        if(isNameDuplicate){return next(new Error('This name is used',{cause:409}))}
        categoryFound.name = name
        categoryFound.slug = slugify(name,'-')
    }
    if(oldPublicId){
        if(!req.file){return next(new Error('Please upload image',{cause:400}))}
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
            public_id: oldPublicId
        })
        categoryFound.Image = {secure_url , public_id}
    }
    categoryFound.updatedBy = _id
    await categoryFound.save()
    res.status(200).json({message:"Updated Done", categoryFound})
}

export const getAllCategories = async(req,res,next)=>{
    const allCategories = await Category.find().populate([{
        path:'Sub-Categories' ,
        populate:[
            {path:'Brands'}
        ]
    }])
    res.status(200).json({message:'All categories',data:allCategories})
}

export const deleteCategory = async(req,res,next)=>{
    const {categoryId} = req.params

    const category = await Category.findByIdAndDelete(categoryId)
    if(!category){return next(new Error('Category not found',{cause:404}))}

    const deleteSubCategories = await SubCategory.deleteMany({categoryId})
    if(!deleteSubCategories.deletedCount){
        console.log('No sub-categories')
    }
    const deleteBrands = await Brand.deleteMany({categoryId})
    if(!deleteBrands.deletedCount){
        console.log('No Brands')
    }

    await cloudinary.api.delete_resources_by_prefix(`${process.env.MAIN_FOLDER}/Categories/${category.folderId}`)
    await cloudinary.api.delete_folder(`${process.env.MAIN_FOLDER}/Categories/${category.folderId}`)

    res.status(200).json({message:'Deleted Done'})
}