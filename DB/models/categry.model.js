import { Schema , model } from "mongoose";
const categorySchema=new Schema(
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
        customid:{
            type:String
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
        updated_by:{
            type:Schema.Types.ObjectId,
            ref:'user',
          //  required:false,
        },
        deleted_by:{
            type:Schema.Types.ObjectId,
            ref:'user',
           // required:false,
        },
/*subcategory:{
    type:Schema.Types.ObjectId,
    ref:'subcategory',
}*/
    },{
        toJSON:{virtuals:true},
        toObject:{virtuals:true},
        timestamps:true
    } 
)

categorySchema.virtual('sub_category',{
    ref:'subcategory',
    foreignField:'category_id',
    localField:'_id'
})
export const categoryModel=model('category',categorySchema);