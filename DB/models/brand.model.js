import { Schema , model } from "mongoose";
const brandSchema=new Schema(
    {
        name:{
            type:String,
            unique:true,
            lowercase:true,
            required:true,
        },
        slug:{
            type:String,
            unique:true,
            lowercase:true,
            required:true,
        },
        logo:{
            secure_url:{
                type:String,
                required:true,
            },
            public_id:{
                type:String,
                required:true,
            },
        },
        created_by:{
            type:Schema.Types.ObjectId,
            ref:'user',
            required:true,
        },
        category_id:{
            type:Schema.Types.ObjectId,
            ref:'category',
            required:true,
        },
        subcategory_id:{
            type:Schema.Types.ObjectId,
            ref:'subcategory',
           required:true,
        },
        customid:String,

    },
    {
        timestamps:true
    }
)
export const brandModel=model('brand',brandSchema);
