
import { Schema ,model} from "mongoose";


const productSchema=new Schema(
{
        title:{
            type:String,
            lowercase:true,
            required:true,
            unique:true
        },
        desc:{
            type:String,
            required:true,
        }, 
        slug:{
        type:String,
        required:true,
        lowercase:true
        },
       colours : [String],
       size:[String],
price:{
    type:Number,
    required:true,
    default:1,
}
,
appliedDiscount:{
    type:Number,
    default:0
},
priceAfterDiscount:{
    type:Number,  
    default:1
},
stock:{
    type:Number,
    required:true,
    default:1,
},
customid:String,
created_by:{
    type:Schema.Types.ObjectId,
    ref:'user',
    required:true,
},
updated_by:{
    type:Schema.Types.ObjectId,
    ref:'user',
    required:false,
},
deleted_by:{
    type:Schema.Types.ObjectId,
    ref:'user',
    required:false,
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
brand_id:{
    type:Schema.Types.ObjectId,
    ref:'brand',
    required:true,
},
images:[
    {
        secure_url:{
            type:String,
            required:true,
        },
        public_id:{
            type:String,
            required:true,
        }
    }
]       
 },
 {
      
        timestamps:true
 }
)
export const productModel=model('product',productSchema);