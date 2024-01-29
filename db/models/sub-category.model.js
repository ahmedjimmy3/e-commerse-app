import { Schema , model} from "mongoose";

const subCategorySchema = new Schema(
    {
        name:{type:String,required:true,unique:true,trim:true},
        slug:{type:String,required:true,unique:true,trim:true},
        Image:{
            secure_url:{type:String,required:true},
            public_id:{type:String,required:true,unique:true},
        },
        folderId:{type:String ,required:true,unique:true},
        addedBy:{type:Schema.Types.ObjectId , ref:'User', required:true},
        updatedBy:{type:Schema.Types.ObjectId , ref:'User'},
        categoryId:{type:Schema.Types.ObjectId, ref:'Category', required:true}
    },
    {
        timestamps:true,
        toObject:true,
        toJSON:true
    }
)

const SubCategory = model('SubCategory' , subCategorySchema)

export default SubCategory