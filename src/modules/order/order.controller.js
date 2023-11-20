import { orderModel } from "../../../DB/models/order.model.js";
import { couponModel } from "../../../DB/models/coupon.model.js";
import { productModel } from "../../../DB/models/product.model.js";
import { isCouponValid } from "../../utils/couponValidation.js";
import { sendEmailService } from "../../services/sendEmail.js";
import { nanoid } from "nanoid";
import createInvoice from "../../utils/pdfkit.js";
//=============create API for one order ===========================
export const createOrder = async (req, res, next) => {
    const userId = req.authuser._id
    const {
      productId,
      quantity,
      address,
      phoneNumbers,
      paymentMethod,
      couponCode,
    } = req.body
  
    // ======================== coupon check ================
    const coupon = await couponModel
    .findOne({ couponCode }).select('isPercentage isFixed couponAmount couponAssignedtoUsers ')
    
  console.log(coupon.couponAssignedtoUsers[0].userId)

    if (couponCode) {
     
      
      const isCouponValidResult = await isCouponValid({
        couponCode,
        userId,
        next,
      })
      if (isCouponValidResult !== true) {
        return isCouponValidResult
      }
      req.coupon = coupon
    }
  
    // ====================== products check ================
    const products = []
    const isProductValid = await productModel.findOne({
      _id: productId,
      stock: { $gte: quantity },
    })
    if (!isProductValid) {
      return next(
        new Error('invalid product please check your quantity', { cause: 400 }),
      )
    }
    const productObject = {
      productId,
      quantity,
      title: isProductValid.title,
      price: isProductValid.priceAfterDiscount,
      finalPrice: isProductValid.priceAfterDiscount * quantity,
    }
    products.push(productObject)
  
    //===================== subTotal ======================
    const subTotal = productObject.finalPrice
    //====================== paid Amount =================
    let paidAmount = 0
    if (req.coupon?.isPercentage) {
      paidAmount = subTotal * (1 - (req.coupon.couponAmount || 0) / 100)
    } else if (req.coupon?.isFixedAmount) {
      paidAmount = subTotal - req.coupon.couponAmount
    } else {
      paidAmount = subTotal
    }
  
    //======================= paymentMethod  + orderStatus ==================
    let orderStatus
    paymentMethod == 'cash' ? (orderStatus = 'placed') : (orderStatus = 'pending')
  
    const orderObject = {
      userId,
      products,
      address,
      phoneNumbers,
      orderStatus,
      paymentMethod,
      subTotal,
      paidAmount,
      couponId: req.coupon?._id,
    }
    const orderDB = await orderModel.create(orderObject)
  
    if (orderDB) {
      // increase usageCount for coupon usage
   
      
      if (req.coupon) {
      
        for (const user of req.coupon.couponAssignedtoUsers) {
          console.log(user.userId.toString())
          if (user.userId.toString() == userId.toString()) {
            user.usageCount += 1
          }
        }
        await req.coupon.save()
      }
      // decrease product's stock by order's product quantity
      await productModel.findOneAndUpdate(
        { _id: productId },
        {
          $inc: { stock: -parseInt(quantity) },
        },
      )
  
      //TODO: remove product from userCart if exist
  //====================ceate invoice ========================
  const orderCode=`${req.authuser.userName}_${nanoid(3)}`
  const orderInvoice={
    shipping:{
      name:req.authuser.userName,
      address:orderDB.address,
      city: 'Cairo',
      state: 'Cairo',
      country: 'Cairo',
    },
    orderCode,
    date: orderDB.createdAt,
    items: orderDB.products,
    subTotal: orderDB.subTotal,
    paidAmount: orderDB.paidAmount,
  }
  await createInvoice(orderInvoice,`${orderCode}.pdf`)
  await sendEmailService(
    {
      to:req.authuser.email,
      subject:'order confirmation',
      message: '<h1> please find your invoice pdf below</h1>',
      attachments: [
        {
          path: `./Files/${orderCode}.pdf`,
        },
      ],
    }
  )
      return res.status(201).json({ message: 'Done', orderDB })

    }
    return next(new Error('fail to create your order', { cause: 400 }))
  }
  //===================convert cart to order=================
  