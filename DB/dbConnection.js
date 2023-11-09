import mongoose from "mongoose";
export const conectDB=async()=>{
return await mongoose
.connect(process.env.urlConnection)
.then((res)=>console.log("DB coneection success"))
.catch((error)=>console.log('DB conecction fail ',error))
}