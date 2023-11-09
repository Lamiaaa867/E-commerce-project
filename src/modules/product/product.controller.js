import slugify from "slugify";
import { brandModel } from "../../../DB/models/brand.model.js";
import { categoryModel } from "../../../DB/models/categry.model.js";
import { subcategoryModel } from "../../../DB/models/subcategory.model.js";
import cloudinary from "../../utils/cloudinary.configration.js";
import { productModel } from "../../../DB/models/product.model.js";
import { customAlphabet } from "nanoid";
import { paginationFn } from "../../utils/pagination.js";
import { json } from "express";
import { apiFeatures } from "../../utils/ApiFeaturesClass.js";

const nanoid=customAlphabet('e_comrceap123456987',5)

//=============add product=============
export const addProduct=async(req,res,next)=>{
    const {category_id,subcategory_id,brand_id}=req.query;
    const {title,desc,colours,size,price,appliedDiscount,stock}=req.body;
    const categoryExist=await categoryModel.findById(category_id);
   
   
    if(!categoryExist){
        return next(new Error('invalid categories',{cause:400}))
    }
    const subcategoryExist=await subcategoryModel.findById(subcategory_id);
    if(!subcategoryExist){
        return next(new Error('invalid sub categories',{cause:400}))
    }
    const brandExist=await brandModel.findById(brand_id);
    if(!brandExist){
        return next(new Error('invalid brand id',{cause:400}))
    }
if(await productModel.findOne({title:title.toLowerCase()})){
    return next(new Error('this product is already exist ,enter another product please',{cause:400}))
}
    const slug=slugify(title,{
        replacement:'_'
    })
  
   // if(appliedDiscount){
        const priceAfterDiscount=price-(price*((appliedDiscount||0)/100))
  //  }
    if(!req.files){
        return next(new Error('please upload files',{cause:404}))
    }
    const customid=nanoid()
    const images=[]
    const public_ids=[]
    for(const file of req.files){
        const{secure_url,public_id}=await cloudinary.uploader.upload(file.path,
            {
folder:`${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/Subcategories/${subcategoryExist.customid}/brands/${brandExist.customid}/products/${customid}`
        })
images.push({secure_url,public_id})
public_ids.push(public_id)
    }
    req.imagepath=`${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/Subcategories/${subcategoryExist.customid}/brands/${brandExist.customid}/products/${customid}`
       
    //console.log(images)
   // console.log(customid)
    const productObject ={title,desc,colours,size,price,appliedDiscount,priceAfterDiscount,stock,slug,customid,
      images,category_id,subcategory_id,brand_id}
        let product =await productModel.create(productObject)
        if(!product){
            await cloudinary.api.delete_resources(public_ids)
            await cloudinary.api.delete_folder(
                `${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/Subcategories/${subcategoryExist.customid}/brands/${brandExist.customid}/products/${customid}`
                 )
            return next(new Error('try again later',{cause:404}))
        }
        res.status(200).json({message:"done",product})
}
//=============delete product===========
export const deleteProduct=async(req,res,next)=>{
    const {category_id,subcategory_id,brand_id,product_id}=req.query;
    const categoryExist=await categoryModel.findById(category_id)
    if(!categoryExist){
        return next(new Error('invalid categgory',{cause:400}))
    }
    const subcategoryExist=await subcategoryModel.findById(subcategory_id)
    if(!subcategoryExist){
        return next(new Error('invalid sub categgory',{cause:400}))
    }
    const brandExist=await brandModel.findById(brand_id)
    if(!brandExist){
        return next(new Error('invalid brand id',{cause:400}))
    }
    const productExist=await productModel.findById(product_id)
    if(!productExist){
        return next(new Error('invalid product id',{cause:400}))
    }
    await cloudinary.api.delete_resources_by_prefix(
        `${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/Subcategories/${subcategoryExist.customid}/brands/${brandExist.customid}/products/${productExist.customid}`
        
        )
   await cloudinary.api.delete_folder(
        `${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/Subcategories/${subcategoryExist.customid}/brands/${brandExist.customid}/products/${productExist.customid}`
         )
         await productModel.findByIdAndDelete(product_id)
         return res.status(200).json({message:'done'})
        }
//==============update product==================
export const updateProduct=async(req,res,next)=>{
    const {title,desc,price,appliedDiscount,colours,size,stock}=req.body
    const {product_id,category_id,subcategory_id,brand_id}=req.query
    const product =await productModel.findById(product_id)
    if(!product)
    {
        return next(new Error('invalid product id',{cause:400}))
    }
    let brandExist
    if(brand_id){
     brandExist=await brandModel.findById(product.brand_id)
    if(!brandExist){
        return next(new Error('invalid brand id',{cause:400}))
    }
    product.brand_id=brand_id
}
let subcategoryExist
if(subcategory_id){
     subcategoryExist=await subcategoryModel.findById(product.subcategory_id)
    if(!subcategoryExist){
        return next(new Error('invalid subcategory id',{cause:400}))
    }
    product.subcategory_id=subcategory_id
}
let categoryExist
if(category_id){
     categoryExist=await categoryModel.findById(product.category_id)
    if(!categoryExist){
        return next(new Error('invalid category id',{cause:400}))
    }
    product.category_id=category_id
}
if(appliedDiscount&&price){
     const priceAfterDiscount=price-(price*((appliedDiscount||0)/100))
     product.priceAfterDiscount=priceAfterDiscount;
     product.price=price;
     product.appliedDiscount=appliedDiscount;

}
else if(price){
    product.price=price;
    const priceAfterDiscount=price-(price*((product.appliedDiscount||0)/100))
    product.priceAfterDiscount=priceAfterDiscount;
}
else if(appliedDiscount){
   
    const priceAfterDiscount=product.price-(product.price*((appliedDiscount||0)/100))
    product.priceAfterDiscount=priceAfterDiscount;
    product.appliedDiscount=appliedDiscount
}

if (req.files?.length) {
    
    let ImageArr = []
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.FOLDER_PROJECT}/categories/${categoryExist.customid}/Subcategories/${subcategoryExist.customid}/brands/${brandExist.customid}/products/${product.customid}`
        },
      )
      ImageArr.push({ secure_url, public_id })
    }
    let public_ids=[]
   //req.body.image=images
    for (const image of product.images) {
        console.log(image.public_id)
        public_ids.push(image.public_ids)
     await cloudinary.uploader.destroy(image.public_id)
    }  
   // await cloudinary.api.delete_all_resources(public_ids)
  }

//const images=[...imagearr];
if(title)
{
    product.title=title;
     const slug=slugify(title,'_')
product.slug=slug
}
if(stock)product.stock=stock;
if(desc)product.desc=desc
if(colours)product.colours=colours
if(size)product.size=size

await product.save()

/*const updateProduct= await productModel.findByIdAndUpdate(
    {_id:product_id},
    req.body,
    {new:true}
)*/
res.status(200).json({message:"done",product})

}   
//==================get all products========================
export const getallproducts=async(req,res,next)=>{
    const {page,size}=req.query;
    const {limit , skip}=paginationFn({page,size})
    console.log(limit)
    console.log(skip)
const allProducts=await productModel.find().limit(limit).skip(skip)

res.status(200).json({message:'Done',allProducts})
}
//=============list products with filters==========
export const listproducts=async(req,res,next)=>{
   //const {searchData,}=req.query
//const allProducts=await productModel.find().sort(searchData.replace(',',' '))
//const allProducts=await productModel.find().select(req.query.select.replaceAll(',',' '))
//=====filters=====
/*const queryData={...req.query}
const queryString=JSON.parse(JSON.stringify(queryData)
.replace(/gt|gte|lt|lte|in|nin|eq|neq regex/g,(match)=>`$${match}`))
const allProducts=await productModel.find(
    queryString
)
*/
const apiFeaturesins=new apiFeatures(productModel.find(),req.query).filter().sort()

const products=await apiFeaturesins.moongoseQuery
res.status(200).json({message:'Done',products})
}
//================================get all products with name =============================
export const getappproductswithName=async(req,res,next)=>{
    const {title ,page ,size}=req.query
    const {limit ,skip}=paginationFn({page,size})
    const product=await productModel.find({
        title:{$regex:title , $options:'i'}
    }).limit(limit).skip(skip)
    return res.status(200).json({message:"dnoe",product})
}