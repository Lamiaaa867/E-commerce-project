import multer from 'multer'
import path from 'path'
/* { customAlphabet } from 'nanoid';
const nanoid= customAlphabet('123456789abcdeghsfee',4)*/
import fs from 'fs'
import { allowedExtension } from '../utils/allowed.extensions.js';
import { nanoid } from 'nanoid';
export const multerFunction=(customvalidation,custompath)=>{
const storage=multer.diskStorage(
    {

        destination:function(req,file,cb){
            
            const pathDest=path.resolve(`uploads/${custompath}`)
            if(!custompath){
                custompath='general'
            }
            if(!fs.existsSync(pathDest)){
                fs.mkdirSync(pathDest,{recursive:true})
            }
            cb(null,pathDest);
        },
        filename:function(req,file,cb){
            const fileName=nanoid()+file.originalname
            cb(null,fileName);
        },

    }
)
const fileFilter=function(req,file,cb){
    if(customvalidation.includes(file.mimetype)){
        return cb(null,true)
    }
    cb(new Error('invalid extension'),false)
}
    const fileupload=multer({ fileFilter,storage})
    return fileupload

}