import { Schema , model} from "mongoose";

const categorySchema = new Schema(
    {
        name:{type:String,required:true,unique:true,trim:true},
        slug:{type:String,required:true,unique:true,trim:true},
        Image:{
            secure_url:{type:String,required:true},
            public_id:{type:String,required:true,unique:true},
        },
        folderId:{type:String ,required:true,unique:true},
        addedBy:{type:Schema.Types.ObjectId , ref:'User', required:true},
        updatedBy:{type:Schema.Types.ObjectId , ref:'User'}
    },
    {
        timestamps:true,
        toObject:true,
        toJSON:true
    }
)

categorySchema.set('toJSON', { virtuals: true })
categorySchema.set('toObject', { virtuals: true })
categorySchema.virtual('Sub-Categories',{
    ref:'SubCategory',
    localField:'_id',
    foreignField:'categoryId'
})

const Category = model('Category' , categorySchema)

export default Category