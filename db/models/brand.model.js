import { Schema , model} from "mongoose";

const brandSchema = new Schema(
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
        categoryId:{type:Schema.Types.ObjectId, ref:'Category', required:true},
        subCategoryId:{type:Schema.Types.ObjectId, ref:'SubCategory', required:true},
    },
    {
        timestamps:true,
        toObject:{virtuals:true},
        toJSON:{virtuals:true}
    }
)

const Brand = model('Brand' , brandSchema)

export default Brand