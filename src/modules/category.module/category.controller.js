 import slugify from "slugify";
 import cloudinary from "../../utils/cloudinary.configration.js";
import { categoryModel } from "../../../DB/models/categry.model.js";
import { customAlphabet } from "nanoid";
import  cursor  from "mongoose";

import { subcategoryModel } from "../../../DB/models/subcategory.model.js";
import {brandModel} from '../../../DB/models/brand.model.js'
const nanoid=customAlphabet('e_comrceap123456987',5)
//=======================creadte new category==========================
 export const createCategory=async(req,res,next)=>{
const {name}=req.body;
const {_id}=req.authuser
if(await categoryModel.findOne({name})){
    return next(new Error ('enter diff category name',{cause:400}))
}
const slugg=slugify((name),'_');
if(!req.file){
    return next(new Error ('plese upload file',{cause:400}))
}
//host
const customid=nanoid()
const data=await cloudinary.uploader.upload(req.file.path ,
    {
folder:`${process.env.FOLDER_PROJECT}/categories/${customid}`
    })
    req.imagepath=`${process.env.FOLDER_PROJECT}/categories/${customid}`
 
    const categoryObject={
        name,
        slug:slugg,
        customid,
        image:{
           secure_url: data.secure_url,         
           public_id: data.public_id,
    },
    created_by:_id
}

   
const category=await categoryModel.create(categoryObject)
if (!category){
    await cloudinary.uploader.destroy(public_id)
    return next(new Error ('try again later to add your category',{cause:400}))
}
return res.status(200).json({message:"added done",category})
 }
 //==================update selected category=============================================
 export const updatecategory=async(req,res,next)=>{
    const {name}=req.body;
    const {_id}=req.authuser
    const{categoryId}=req.query;
    console.log(_id)
    const selected_Category=await categoryModel.findOne({_id:categoryId, created_by:_id})
    //category isn,t exist
    if(!selected_Category){
        return next(new Error('invalid categry id',{cause:404}))
    }
    //categry name conditions
    if(name){
        if(selected_Category.name==name){
            return next(new Error('enter diff categry name please',{cause:400}))
        }
//unoque name
if(await categoryModel.findOne({name})){
    return next(new Error('this category already exist , enter diff categry name please',{cause:400}))
}
selected_Category.name=name;
selected_Category.slug=slugify(name,'_')

    }
    //update file
    if(req.file){
        //delete old file
        await cloudinary.uploader.destroy(selected_Category.image.public_id)
        //upload new image
       // const custom_id=nanoid();
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,
            {
                folder:`${process.env.FOLDER_PROJECT}/categories/${selected_Category.custom_id}`
            })
    //console.log(secure_url)
    //console.log(public_id)
    selected_Category.image={secure_url,public_id}
        }
        selected_Category.updated_by=_id
        await selected_Category.save()
        return res.status(200).json({message:"updated done" , selected_Category})
    }
 //=====================get all categories================
 export const getallcategories=async(req,res,next)=>{
/*let catarr=[];
const cursor=await categoryModel.find().cursor()
for(let doc=await cursor.next(); doc!=null;doc = await cursor.next()){
    const subcategory= await subcategoryModel.find({
        category_id:doc._id
    })
    const objectcat=doc.toObject();
    objectcat.subcategory=subcategory
    catarr.push(objectcat)
}*/
const allcategories=await categoryModel.find().populate([{
path:'sub_category',
populate:[
    {
        path:'brands'
    }
]
}])
console.log({allcategories})
return res.status(200).json({message:'done',allcategories})
 }
 //=================================delete category========================
 export const deleteCategory=async(req,res,next)=>{
const {category_id}=req.query
const {_id}=req.authuser
const categoryExist = await categoryModel.findOne({category_id, created_by:_id})
if(!categoryExist){

    return next(new Error ('invalid category id',{cause:400}))
}
console.log(categoryExist)
//delete all images==
await cloudinary.api.delete_resources_by_prefix(
    `${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}`
)
await cloudinary.api.delete_folder(
    `${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}`
)

const deleteRelatedSubcategory=await subcategoryModel.deleteMany(
    {
       category_id:category_id
    }
)
const deleteRelatedBrands=await brandModel.deleteMany(
    {
       category_id:category_id
    }
)
if (!deleteRelatedBrands.deletedCount||!deleteRelatedSubcategory.deletedCount){
    return next(new Error ('deleted fail',{cause:500}))
}
await categoryModel.findOneAndDelete({category_id ,created_by:_id})
return res.status(200).json({message:'done'})
 }
 //================================update category=========================
 