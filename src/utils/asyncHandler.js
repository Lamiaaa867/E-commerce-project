import cloudinary from "./cloudinary.configration.js"

export const asynchandler=(API)=>{
    return(req,res,next)=>{
        API(req,res,next).catch(async(error)=>{
console.log(error)
console.log(req.imagepath)
if(req.imagepath){
    await  cloudinary.api.delete_resources_by_prefix(
       req.imagepath  )
    await cloudinary.api.delete_folder(
       req.imagepath   )
}
return next(new Error (error,{cause:500}))
        })
    }
}

//===============Glopal MiddleWare====================
export const globalMiddleWare=(err,req,res,next)=>{
    if(err){
        console.log(err.message)
    return res.status(err['cause']||500).json({message:err.message})
    }
}