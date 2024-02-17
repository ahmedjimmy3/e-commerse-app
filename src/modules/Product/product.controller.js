import Product from "../../../db/models/product.model.js"
import Brand from '../../../db/models/brand.model.js'
import systemRoles from "../../utils/system-roles.js"
import slugify from 'slugify'
import cloudinary from "../../utils/cloduinary.js"
import generateUniqueString from "../../utils/generate-unique-string.js"
import APIFeatures from "../../utils/api-features.js"

export const addProduct = async(req,res,next)=>{
    const {title,description,basePrice,discount,stock,specifications} = req.body
    const {categoryId,subCategoryId,brandId} = req.query
    const {_id} = req.authUser

    const brandCheck = await Brand.findById(brandId).populate([
        {path:'categoryId', select:'folderId'},
        {path:'subCategoryId', select:'folderId'},
    ]) 
    if(!brandCheck){return next(new Error('This Brand not found',{cause:404}))}

    if(brandCheck.categoryId._id.toString() !== categoryId){
        return next(new Error('This Category not found',{cause:404}))
    }
    if(brandCheck.subCategoryId._id.toString() !== subCategoryId){
        return next(new Error('This SubCategory not found',{cause:404}))
    }

    if(brandCheck.addedBy.toString() !== _id.toString() && req.authUser.role!==systemRoles.SUPER_ADMIN){
        return next(new Error('You are not allow to add product in this brand',{cause:401}))
    }

    const slug = slugify(title,{lower:true,replacement:'-'})

    const folderId = generateUniqueString(6)
    let Images = []
    const folder = brandCheck.Image.public_id.split(`${brandCheck.folderId}/`)[0]
    for (const file of req.files) {
        const {secure_url,public_id} = await cloudinary.uploader.upload(file.path, {
            folder: folder + `${brandCheck.folderId}` + `/Products/${folderId}`
        })
        Images.push({secure_url,public_id})
    }
    req.folder = folder + `${brandCheck.folderId}` + `/Products/${folderId}`
    
    const appliedPrice = basePrice - (((discount||0)*basePrice) / 100)

    const newProduct = {
        categoryId,subCategoryId,brandId,addedBy:_id,folderId,Images,
        title,description,slug,basePrice,discount,appliedPrice,stock,specifications:JSON.parse(specifications),
    }
    const createdProduct = await Product.create(newProduct)
    req.createdDocument = {model:Product, query:createdProduct._id}

    res.status(201).json({message:'Created Product Done', createdProduct})
}

export const updateProduct = async(req,res,next)=>{
    const {title,description,basePrice,discount,oldPublicId,specifications,stock} = req.body
    const {productId} = req.params
    const {_id} = req.authUser

    const productFound = await Product.findById(productId)
    if(!productFound){return next(new Error('Product not found',{cause:404}))}

    if(productFound.addedBy.toString()!= _id.toString()&& req.authUser.role != systemRoles.SUPER_ADMIN){
        return next(new Error('You are not authorized to update this product',{cause:401}))
    }

    if(title){
        productFound.title = title
        productFound.slug = slugify(title,{replacement:'-',lower:true})
    }
    if(description){ productFound.description = description}
    if(specifications){productFound.specifications = JSON.parse(specifications)}
    if(stock){productFound.stock = stock}
    if(basePrice){productFound.basePrice = basePrice}
    if(discount){productFound.discount = discount}

    const appliedPrice = (basePrice||productFound.basePrice) - (((discount||productFound.discount)*(basePrice||productFound.basePrice)) / 100)
    productFound.appliedPrice = appliedPrice

    if(oldPublicId){
        const folderPath = productFound.Images[0].public_id.split(`${productFound.folderId}/`)[0]
        if(!req.file){return next(new Error('Please upload image',{cause:400}))}
        const {secure_url} = await cloudinary.uploader.upload(req.file.path,{
            public_id:oldPublicId
        })
        productFound.Images.map((img)=>{
            if(img.public_id == oldPublicId){
                img.secure_url = secure_url
            }
        })
        req.folder = folderPath + `${productFound.folderId}`
    }


    await productFound.save()
    res.status(200).json({message:'Updated Done'})
}

export const getAllProducts = async(req,res,next)=>{
    const {page,size,sort , ...search} = req.query
    const features = new APIFeatures(Product.find())
    // .filter(search)
    // .search(search)
    .pagination({page,size})
    // .sort(sort)

    const products = await features.mongooseQuery

    res.status(200).json({message:'All Products',products})
}

export const getProductById = async(req,res,next)=>{
    const {productId} = req.params
    const product = await Product.findById(productId)
    if(!product){return next(new Error('This product is not found',{cause:404}))}
    res.status(200).json({data:product})
}

export const deleteProduct = async(req,res,next)=>{
    const {productId} = req.params
    const productDeleted = await Product.findByIdAndDelete(productId)
    if(!productDeleted){return next(new Error('Deletion Failed',{cause:400}))}
    const folderPath = productDeleted.Images[0].public_id.split(`${productDeleted.folderId}/`)[0]
    await cloudinary.api.delete_resources_by_prefix(folderPath+`${productDeleted.folderId}`)
    await cloudinary.api.delete_folder(folderPath+`${productDeleted.folderId}`)
    res.status(200).json({message:'Deletion Done'})
}