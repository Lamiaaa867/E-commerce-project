import { userModel } from "../../DB/models/user.model.js";
import { generateToken,verifyToken } from "../utils/tokenfunctions.js";
//=======================user authentkated or not====================
export const isAuth=(roles)=>{
    return async(req,res,next)=>{
try{        
const {authorization}=req.headers
if(!authorization){
    return next(new Error('please log in ',{cause :400}))
}
if(!authorization.startsWith(process.env.prefix)){
    return next(new Error('false prefix',{cause :400}))
}
 const splitedToken = authorization.split(' ')[1]
 //console.log(splitedToken)
try{
const decodedData=verifyToken(
    {
        token:splitedToken,
        signature:process.env.logInSecretkey
    }
)
const findUser=await userModel.findById(
    decodedData.id,
    'email userName role'
)
//console.log(findUser)
if(!findUser){
    return next(new Error('please signup',{cause :400}))
}    

//==================authorization===================
//console.log(req.authuser)
if(!roles.includes(findUser.role)){
  return next(new Error('unouthrized access to API ',{cause :400}))
}
req.authuser=findUser
next()  
}

catch (error) {
    // token  => search in db
    if (error == 'TokenExpiredError: jwt expired') {
      // refresh token
      const user = await userModel.findOne({ token: splitedToken })
      if (!user) {
        return next(new Error('Wrong token', { cause: 400 }))
      }
      // generate new token
      const userToken = generateToken({
        payload: {
          email: user.email,
          id: user._id,
          role:user.role
        },
        signature: process.env.logInSecretkey,
        expiresIn: '1h',
      })

      if (!userToken) {
        return next(
          new Error('token generation fail, payload canot be empty', {
            cause: 400,
          }),
        )
      }
     console.log(splitedToken)
      //console.log(userToken)
     // user.token = userToken
      //await user.save()
       const updatedUserToken=await userModel.findOneAndUpdate({
        token:splitedToken
       },
       {
        token:userToken,
       }
       ,{
        new:true
       })
       console.log(updatedUserToken)
      // res.status(200).json({ message: 'Token refreshed', updatedUserToken })

       next()
    }
    return next(new Error('invalid token', { cause: 500 }))
  }

}
        catch(error){
console.log(error)
return next(new Error('error in auth',{cause:500}))
        }
    }
}