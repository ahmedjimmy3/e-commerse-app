import { Schema,model } from "mongoose";

const productSchema = new Schema(
    {
        // strings
        title:{type:String,required:true},
        slug:{type:String,required:true},
        description:{type:String,required:true},
        // IDs
        addedBy:{type:Schema.Types.ObjectId,ref:'User',required:true},
        updatedBy:{type:Schema.Types.ObjectId,ref:'User'},
        categoryId:{type:Schema.Types.ObjectId,ref:'Category',required:true},
        subCategoryId:{type:Schema.Types.ObjectId,ref:'SubCategory',required:true},
        brandId:{type:Schema.Types.ObjectId,ref:'Brand',required:true},
        // images
        Images:[{
            secure_url:{type:String,required:true} , 
            public_id:{type:String,required:true}
        }],
        folderId:{type:String,required:true},
        // numbers
        price:{type:Number,required:true},
        discount:{type:Number,default:0},
        appliedPrice:{type:Number,required:true},
        stock:{type:Number,required:true,min:1},
        avgRating:{type:Number,min:1,max:5},
        // map
        specifications:{
            type:Map,
            of:[String]
        }
    },
    {
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
)

const Product = model('Product',productSchema)
export default Product