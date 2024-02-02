import Brand from '../../../db/models/brand.model.js'
import SubCategory from '../../../db/models/sub-category.model.js'
import cloudinary from '../../utils/cloduinary.js'
import rollbackOperation from '../../utils/general-rollback-function.js'
import generateUniqueString from '../../utils/generate-unique-string.js'
import slugify from 'slugify'

export const addBrand = async(req,res,next)=>{
    const {name} = req.body
    const {categoryId , subCategoryId} = req.query
    const {_id} = req.authUser

    const isSubCategoryExist = await SubCategory.findById(subCategoryId).populate('categoryId')
    if(!isSubCategoryExist){return next(new Error('This sub-category not found',{cause:404}))}

    const isBrandExist = await Brand.findOne({name},{subCategoryId})
    if(isBrandExist){return next(new Error('This brand already exist',{cause:400}))}

    if(isSubCategoryExist.categoryId._id.toString() != categoryId){
        return next(new Error('Category not found',{cause:404}))
    }

    const slug = slugify(name,'-')

    if(!req.file){return next(new Error('please upload the brand logo..',{cause:400}))}
    const folderId = generateUniqueString(6)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.MAIN_FOLDER}/Categories/${isSubCategoryExist.categoryId.folderId}/subCategories/${isSubCategoryExist.folderId}/Brands/${folderId}`
    })

    const newBrand = {
        name,
        slug,
        Image:{secure_url,public_id},
        folderId,
        addedBy: _id,
        categoryId,
        subCategoryId
    }

    const createdBrand = await Brand.create(newBrand)
    res.status(201).json({message:'Brand created successfully' , data:createdBrand})
}

async function createDocument(data) {
    const newDocument = new Brand(data);
    await newDocument.save();
    // If you have other related operations, perform them here
}

export const createDocumentController = async (req, res) => {
    const result = await rollbackOperation(createDocument, req.body);
    if (result.success) {
        res.status(201).json({ message: result.message });
    } else {
        res.status(500).json({ error: result.error });
    }
};