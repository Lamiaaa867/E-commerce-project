
import { Schema , model } from "mongoose";
const couponSchema=new Schema(
    {
       couponCode:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
       },
       couponAmount:{
        type:Number,
        required:true,
        min:1,
        max:100,
        default:1
         },
         isPrecentage:{
            type:Boolean,
            required:true,
            default:false
         },
         isFixed:{
            type:Boolean,
            required:true,
            default:false
         },
         created_by:{
            type:Schema.Types.ObjectId,
            ref:'user',
            required:true,
        },
        updated_by:{
            type:Schema.Types.ObjectId,
            ref:'user',
           // required:true,
            
        },
        deleted_by:{
            type:Schema.Types.ObjectId,
            ref:'user',
           // required:true,
        },
        couponAssignedtoUsers:[
            {
              userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
              },
              maxUsage: {
                type: Number,
                required: true,
              },
              usageCount: {
                type: Number,
                default: 0,
              },
            },
          ],
     /*   couponAssignedtoProducts:[
            {
              userId:{  type: Schema.Types.ObjectId,
                ref: 'Product',
              },
              maxUsage: {
                type: Number,
                required: true,
              },
            }

        ],*/
        startDate:{
            type:String,
            required:true,

        },
        endDate:{
            type:String,
            required:true,
            
        },
        couponStatus:{
            type:String,
            required:true,
            enum:['expired','valid'],
            default:'valid'
        }

        
    },{
        timestamps:true,
    }
)
export const couponModel=model('coupon',couponSchema);
 /*"couponAssignedtoUsers":[
   {
     "userId":"653bab60d3dcc89401da3dee",
     "maxUsage":4
   },
   {
      "userId":"653bb08ac6ffb55d6220d77a",
     "maxUsage":8
   }
   
   ]*/