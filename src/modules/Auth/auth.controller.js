import { userModel } from "../../../DB/models/user.model.js";
import { sendEmailService } from "../../services/sendEmail.js";
import { emailTemplate } from "../../utils/email template.js";
import { generateToken, verifyToken } from "../../utils/tokenfunctions.js";
import pkg from 'bcryptjs'
import { customAlphabet } from "nanoid";
const nanoid=customAlphabet('0123456789',4)
//=====================sign up API============================
export const signUp=async(req,res,next)=>{
const {
    userName,
    email,
    gender,
    password,
    address,
    age,
    phoneNumber
}=req.body
const isExist =await userModel.findOne({email})
if(isExist){
   return  next(new Error('this user is already signed up',{cause:400}))
}
const token=generateToken({payload:{
    email:email
}
    ,
signature:process.env.secretKey,
expiresIn:'1h'
})
const Confirmedlink=`${req.protocol}://${req.headers.host}/user/confirm/${token}`
const sendEmail=sendEmailService({
    to:email,
    subject:'confirmation mail',
    message:emailTemplate({
        link:Confirmedlink,
        linkData:"click here to confirm",
        subject:"confirmation mail"
    })
})
if(!sendEmail){
   return next(new Error('fail to confirm link',{cause:400}))
}
const user = new userModel({
    email,
    userName,
    password,
    gender,
    age,
    address,
    phoneNumber,
})
const saveuser= await user.save()
return res.status(201).json({message:'added ',saveuser})
}
//================================confirm email===================
export const confirmEmail=async(req,res,next)=>{
    const { token}=req.params
    const decode=verifyToken({
        token,
        signature:process.env.secretKey
    })
    console.log(decode)

    const user= await userModel.findOneAndUpdate({
        email:decode?.email,
        isConfirmed:false
    },{
        isConfirmed:true 
    },
    {new:true})
    console.log(user)
    if(!user){
        return next(new Error('fail to confirm link',{cause:400}))  
    }
    return res.status(201).json({message:'added ',user}) 
}
//==================log in ==========================
export const logIn=async(req,res,next)=>{
    const {email ,password}=req.body;
    const userExist=await userModel.findOne({email})
    if(!userExist){
        return next(new Error('please sign up',{cause:400})) 
    }
    const passMatch=pkg.compareSync(password,userExist.password)
    if(!passMatch){
        return next(new Error('wrong password',{cause:400})) 
    }
    const token = generateToken({
        payload:{
            email:email,
            id:userExist._id,
            role:userExist.role
        },
        signature:process.env.logInSecretkey,
        expiresIn:'1h',
    })
    const updatedUser= await userModel.findOneAndUpdate({email},{
        token:token,
        status:'online'
    },
    {
        new:true
    })
    res.status(200).json({message:"logged in ",updatedUser})
}
//===============forget password===============================
export const forgetPass=async(req,res,next)=>{
    const {email}=req.body
    const userExist=await userModel.findOne({email})
    if(!userExist){
        return next(new Error('please sign up',{cause:400})) 
    }
    const code=nanoid();
    const hashedCode = pkg.hashSync(code,8)
    const token = generateToken({
        payload:{
         email:email,
        sentCode:hashedCode
        },
        signature:process.env.forgetCodeSecretkey,
        expiresIn:'1h',
    })
    const resetPass= `${req.protocol}://${req.headers.host}/user/reset/${token}`
    const sendEmail=sendEmailService({
        to:email,
        subject:'reset mail',
        message:emailTemplate({
            link:resetPass,
            linkData:"click here to reset your password",
            subject:"reset password  mail"
        })
    })
    if(!sendEmail){
        return next(new Error('fail to send mail to reset your pass try again later',{cause:400}))    
    }
    const user=await userModel.findOneAndUpdate({email},
        {
            forgetCode:hashedCode
        },{
            new:true
        })
        return res.status(200).json ({message:"send reset mail successfully",user})
}
///===============================reset=============================================
export const resetPassword = async (req, res, next) => {
    const { token } = req.params
    const decoded = verifyToken({ token, signature: process.env.forgetCodeSecretkey})
    console.log(decoded)
    const { newpassword } = req.body
    const user = await userModel.findOneAndUpdate({
      email: decoded?.email,
      forgetCode: decoded?.sentCode,
    },{
        password:newpassword,
        forgetCode:null,
    },{
        new:true
    }
    )
    console.log (user)
    if (!user) {
      return next(
        new Error('your already reset your password once before , try to login', {
          cause: 400,
        }),
      )
    }
  
   
   
    res.status(200).json({ message: 'Done', user })
  }