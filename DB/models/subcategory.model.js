import { Schema , model } from "mongoose";
const subcategorySchema=new Schema(
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
        image:{
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
        customid:{
            type:String,
            required:true
        }
    },{
        toJSON:{virtuals:true},
        toObject:{virtuals:true},
        timestamps:true
    }
)
subcategorySchema.virtual('brands',{
    ref:'brand',
    foreignField:'subcategory_id',
    localField:'_id'
})
export const subcategoryModel=model('subcategory',subcategorySchema);







