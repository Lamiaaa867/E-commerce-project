import  {cartModel}  from "../../../DB/models/cart.model.js";
import {productModel} from '../../../DB/models/product.model.js'
export const addToCart = async(req,res,next)=>{
    const { productId
        ,quantity}=req.body;
    const userId=req.authuser._id;
    //chack product 
    const productCheck= await productModel.findOne({
_id:productId,
stock:{$gte:quantity}
    })
    if(!productCheck){
        return next(
            new Error('inavlid product please check the quantity', { cause: 400 }),
          )
    }
    const userCart= await cartModel.findOne({userId}).lean()
    if(userCart){
        let productExists = false
        for (const product of userCart.products) {
          if (productId == product.productId) {
            productExists = true
            product.quantity = quantity
          }
        }
        // push new product
        if (!productExists) {
          userCart.products.push({ productId, quantity })
        }
    
        // subTotal
        let subTotal = 0
        for (const product of userCart.products) {
          const productExists = await productModel.findById(product.productId)
          subTotal += productExists.priceAfterDiscount * product.quantity || 0
        }
        const newCart = await cartModel.findOneAndUpdate(
          { userId },
          {
            subTotal,
            products: userCart.products,
          },
          {
            new: true,
          },
        )
        return res.status(200).json({ message: 'Done', newCart })
     
    }
    const cartObject = {
        userId,
        products: [{ productId, quantity }],
        subTotal: productCheck.priceAfterDiscount * quantity,
      }
      const cartDB = await cartModel.create(cartObject)
      res.status(201).json({ message: 'Done', cartDB })
}
//====================delete from cart==================
export const deleteFromCart = async (req, res, next) => {
    const userId = req.authuser._id
    const { productId } = req.body
  
    // ================== product check ==============
    const productCheck = await productModel.findOne({
      _id: productId,
    })
    if (!productCheck) {
      return next(new Error('inavlid product id', { cause: 400 }))
    }
  
    const userCart = await cartModel.findOne({
      userId,
      'products.productId': productId,
    })
    if (!userCart) {
      return next(new Error('no productId in cart '))
    }
    userCart.products.forEach((ele) => {
      if (ele.productId == productId) {
        userCart.products.splice(userCart.products.indexOf(ele), 1)
      }
    })
    await userCart.save()
    res.status(200).json({ message: 'Done', userCart })
  }
  