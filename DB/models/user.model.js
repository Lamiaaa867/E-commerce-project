import { Schema,model } from "mongoose";
import pkg from 'bcryptjs'
import { systemRoles } from "../../src/utils/system.roles.js";
const userSchema=new Schema(
    {
      userName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      isConfirmed: {
        type: Boolean,
        required: true,
        default: false,
      },
      role: {
        type: String,
        default: systemRoles.USER,
        enum: [systemRoles.USER, systemRoles.ADMIN, systemRoles.SUPERADMIN],
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      address: [
        {
          type: String,
          required: true,
        },
      ],
      profilePicture: {
        secure_url: String,
        public_id: String,
      },
      status: {
        type: String,
        default: 'Offline',
        enum: ['Online', 'Offline'],
      },
      gender: {
        type: String,
        default: 'Not specified',
        enum: ['male', 'female', 'Not specified'],
      },
      age: Number,
      token: String,
      forgetCode: String,
    },{
    timestamps:true
})
userSchema.pre('save',function(next , hashPass){
this.password=pkg.hashSync(this.password,8)
next()

})
export const userModel=model('user',userSchema)