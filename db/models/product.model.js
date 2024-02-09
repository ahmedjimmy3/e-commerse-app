import { Schema,model } from "mongoose";

const productSchema = new Schema(
    {
        // strings
        title:{type:String,required:true,trim:true},
        slug:{type:String,required:true},
        description:{type:String},
        folderId:{type:String,required:true},
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
        // numbers
        basePrice:{type:Number,required:true},
        discount:{type:Number,default:0},
        appliedPrice:{type:Number,required:true},
        stock:{type:Number,required:true,min:0,default:0},
        avgRating:{type:Number,min:0,max:5,default:0},
        // map
        specifications:{
            type:Map,
            of:[String | Number]
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