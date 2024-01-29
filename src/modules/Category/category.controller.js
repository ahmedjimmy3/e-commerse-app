import Category from "../../../db/models/category.model.js"
import slugify from 'slugify'
import generateUniqueString from '../../utils/generate-unique-string.js'
import cloudinary from "../../utils/cloduinary.js"

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
    const allCategories = await Category.find().populate('Sub-Categories')
    res.status(200).json({message:'All categories',data:allCategories})
}