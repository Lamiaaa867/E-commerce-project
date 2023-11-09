import slugify from "slugify";
import cloudinary from "../../utils/cloudinary.configration.js";
import { categoryModel } from "../../../DB/models/categry.model.js";
import { customAlphabet } from "nanoid";
import { subcategoryModel } from "../../../DB/models/subcategory.model.js";
import { brandModel } from "../../../DB/models/brand.model.js";
import { productModel } from "../../../DB/models/product.model.js";
const nanoid=customAlphabet('e_comrceap123456987',5)

export const createSubCategory=async(req,res,next)=>{
    const {category_id}=req.query;
const {name}=req.body;
const category = await categoryModel.findById({_id:category_id})
if(!category){
    return next(new Error ('enter valid id',{cause:400}))
 }
if(await subcategoryModel.findOne({name})){
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
folder:`${process.env.FOLDER_PROJECT}/categories/${category.customid}/subcategories/${customid}`
   })
   req.imagepath=`${process.env.FOLDER_PROJECT}/categories/${category.customid}/subcategories/${customid}`
   const subcategoryObject={
       name,
       slug:slugg,
       customid,
       image:{
          secure_url: data.secure_url,         
          public_id: data.public_id,
   },
   category_id
}

const subCategory=await subcategoryModel.create(subcategoryObject)
if (!subCategory){
   await cloudinary.uploader.destroy(public_id)
   return next(new Error ('try again later to add your category',{cause:400}))
}
await categoryModel.findByIdAndUpdate({_id:category_id},{
    $push:{
        subcategory:subCategory._id
    }
})
 return res.status(200).json({message:"added done",subCategory})
}
//=======================get all subcategories===========================
export const getallsubcategories=async(req,res,next)=>{
    const subCategory=await subcategoryModel.find().populate(
        [
            {
                path:'category_id',
                select:'slug'
            }
        ]
    )
    return res.status(200).json({message:"done",subCategory})
}
//===============delete subcategory======================================
export const deleteSubcategory=async(req,res,next)=>{
    const {category_id,subcategory_id}=req.query
    const categoryExist=await categoryModel.findById(category_id)
    if(!categoryExist){
        return next(new Error('invalid category id', {cause:400}))
    }
    const subcategoryExist=await subcategoryModel.findById(subcategory_id)
    if(!subcategoryExist){
        return next(new Error('invalid sub-category id', {cause:400}))
    }
    await cloudinary.api.delete_resources_by_prefix(
        `${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/subcategories/${subcategoryExist.customid}`
    )
    await cloudinary.api.delete_folder(
        `${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/subcategories/${subcategoryExist.customid}`
        )
        const deleteRelatedBrands=await brandModel.deleteMany(
            {
            subcategory_id
            }
        )    
        const deleteRelatedproducts=await productModel.deleteMany(
            {
            subcategory_id
            }
        )       
        if (!deleteRelatedBrands.deletedCount||!deleteRelatedproducts.deletedCount){
            return next(new Error ('deleted fail',{cause:500}))
        }
        await subcategoryModel.findByIdAndDelete(subcategory_id)
        return res.status(200).json({message:'done'})
}
//======================update subcategory==============================
export const updatesubcategory=async(req,res,next)=>{
    const {name} = req.body

  const { category_id, subcategory_id} = req.query

  // check productId
  const subCategory = await subcategoryModel.findById(subcategory_id)
  if (!subCategory) {
    return next(new Error('invalid subcategory id', { cause: 400 }))
  }
  const categoryExist = await categoryModel.findById(
    category_id||subCategory.category_id,
  )
  if (category_id) {
    if (!categoryExist) {
      return next(new Error('invalid categories', { cause: 400 }))
    }
    
    subCategory.category_id=category_id
  }
  if (req.file){
    let public_ids=[]
    await cloudinary.uploader.destroy(subCategory.image.public_id)
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/subcategories/${subCategory.customid}`        },
      )
     
      subcategory.image={secure_url,public_id}
     
  }
if(name)
{
  if (subCategory.name==name.toLowerCase()) {
    return next(new Error('please enter diff name', { cause: 400 }))
  }
  if (await subcategoryModel.findOne(
  {
    name:name.toLowerCase()
  }
  )){
    return next(new Error('duplicated ,please enter diff name ', { cause: 400 }))
 
  }
    subCategory.name = name
    subCategory.slug = slugify(name, '-')
}
 
 
    await subCategory.save()

  res.status(200).json({ message: 'Done',subCategory })
}