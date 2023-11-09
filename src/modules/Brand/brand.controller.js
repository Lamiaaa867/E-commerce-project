import slugify from "slugify";
import { categoryModel } from "../../../DB/models/categry.model.js"
import { subcategoryModel } from "../../../DB/models/subcategory.model.js";
import cloudinary from "../../utils/cloudinary.configration.js";
import { customAlphabet } from "nanoid";
import { brandModel } from "../../../DB/models/brand.model.js";
import { productModel } from "../../../DB/models/product.model.js";
import { paginationFn } from "../../utils/pagination.js";
import { apiFeatures } from "../../utils/ApiFeaturesClass.js";
//import { subcategoryModel } from "../../../DB/models/subcategory.model.js";
const nanoid=customAlphabet('e_comrceap123456987',5)
//==================add brand====================
export const addbrand=async(req,res,next)=>{
    const {name}=req.body
    const {category_id,subcategory_id}=req.query
    const categoryExist=await categoryModel.findById(category_id);
    
    if(!categoryExist){
        return next(new Error('invalid category',{cause:400}))
    }
    const subcategoryExist=await subcategoryModel.findById(subcategory_id);
    if(!subcategoryExist){
        return next(new Error('invalid sub category',{cause:400}))
    }
    if(await brandModel.findOne({name:name.toLowerCase()})){
        return next(new Error('this brand is already exist ,enter another product please',{cause:400}))
    }
    const slug=slugify(name,{
        replacement:'_',
        lower:true
    })
    if(!req.file){
        return next(new Error('please upload file ',{cause:400}))
    }
    const customid=nanoid()
    const {secure_url , public_id}= await cloudinary.uploader.upload(req.file.path,{
folder:`${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/Subcategories/${subcategoryExist.customid}/brands/${customid}`
    })
    req.imagepath=`${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/Subcategories/${subcategoryExist.customid}/brands/${customid}`
    
const brandobject ={
    name,
    slug,
    logo:{secure_url , public_id},
    category_id,
    subcategory_id,
    customid,

}

const brandData= await brandModel.create(brandobject)
if(!brandData){
    await cloudinary.uploader.destroy(public_id)
    return next(new Error('try again later',{cause:400}))
}
return res.status(200).json({message:'done',brandData})
}
//==================delete brand=========================
export const deletebrand=async(req,res,next)=>{
    const {category_id,subcategory_id,brand_id}=req.query;
    const categoryExist=await categoryModel.findById(category_id)
    const subcategoryExist=await subcategoryModel.findById(subcategory_id)
    const brandExist=await brandModel.findById(brand_id)
    if(!brandExist||!subcategoryExist||!categoryExist){
        return next(new Error('invalid IDS',{cause:400}))
    }
    await cloudinary.api.delete_resources_by_prefix(
        `${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/Subcategories/${subcategoryExist.customid}/brands/${brandExist.customid}`
    )
    await cloudinary.api.delete_folder(
        `${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/Subcategories/${subcategoryExist.customid}/brands/${brandExist.customid}` 
    )
    const deleteRelatedproducts=await productModel.deleteMany(
        {
        brand_id
        }
    ) 
    if (!deleteRelatedproducts.deletedCount){
        return next(new Error ('deleted fail',{cause:500}))
    }
    await brandModel.findByIdAndDelete(brand_id)
    return res.status(200).json({message:'done'})
}
//============update brand========================
export const updateBrand=async(req,res,next)=>{
    const {name} = req.body

  const { category_id, subcategory_id, brand_id } = req.query

  // check productId
  const brand = await brandModel.findById(brand_id)
  if (!brand) {
    return next(new Error('invalid brand id', { cause: 400 }))
  }
  const subcategoryExist = await subcategoryModel.findById(
    subcategory_id || brand.subcategory_id,
  )
  if (subcategory_id) {
     if (!subcategoryExist) {
      return next(new Error('invalid subcategories', { cause: 400 }))
     }
    brand.subcategory_id=subcategory_id
  }
  const categoryExist = await categoryModel.findById(
    category_id||brand.category_id,
  )
  if (category_id) {
    if (!categoryExist) {
      return next(new Error('invalid categories', { cause: 400 }))
    }
    
    brand.category_id=category_id
  }
  if (req.file){
    let public_ids=[]
    await cloudinary.uploader.destroy(brand.logo.public_id)
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/Subcategories/${subcategoryExist.customid}/brands/${brand.customid}`
        },
      )
     
      brand.logo={secure_url,public_id}
     
  }
if(name)
{
  if (brand.name==name.toLowerCase()) {
    return next(new Error('please enter diff name', { cause: 400 }))
  }
  if (await brandModel.findOne(
  {
    name:name.toLowerCase()
  }
  )){
    return next(new Error('duplicated ,please enter diff name ', { cause: 400 }))
 
  }
    brand.name = name
    brand.slug = slugify(name, '-')
}
 
 
    await brand.save()

  res.status(200).json({ message: 'Done', brand })
}
//=============== get brand data=========
export const getallBrands=async(req,res,next)=>{
  const apiFeaturesins = new apiFeatures(brandModel.find(),req.query).pagination()
  const brands =await apiFeaturesins.moongoseQuery
  res.status(200).json({message:'done',brands})
}
//==================sort brands============
export const sortallBrands=async(req,res,next)=>{
  const apiFeaturesins = new apiFeatures(brandModel.find(),req.query).sort()
  const brands =await apiFeaturesins.moongoseQuery
  res.status(200).json({message:'done',brands})
}
//===============filter=============
