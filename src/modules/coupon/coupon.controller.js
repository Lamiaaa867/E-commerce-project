import { couponModel } from "../../../DB/models/coupon.model.js"
import { userModel } from "../../../DB/models/user.model.js"


export const addCoupon=async(req,res,next)=>{
    const {
        couponCode,
        couponAmount,
        startDate,
        endDate,
       couponAssignedtoUsers,
        isFixed,
        isprecantage
    }=req.body
    const {_id}=req.authuser
    //check if coupon duplicated or not
    const duplicateCoupon=await couponModel.findOne({couponCode})
    if(duplicateCoupon){
        next(new Error('duplicate code',{cause:400}))
    }
    //check the if we discount fixed or precentage
    if((!isFixed&&!isprecantage)||(isFixed&&isprecantage)){
        next(new Error('please select specific way for discount',{cause:400}))
    }
    //==========coupons assigned to users==================
   let usersIds = []
    for (const user of couponAssignedtoUsers) {
      usersIds.push(user.userId)
    }
  
    const usersCheck = await userModel.find({
      _id: {
        $in: usersIds,
      },
    })
  
    if (usersIds.length !== usersCheck.length) {
      return next(new Error('invalid userIds', { cause: 400 }))
    }
  
    const couponObject={
        couponCode,
        couponAmount,
        startDate,
        endDate,
        isFixed,
        created_by:_id,
        couponAssignedtoUsers,
        isprecantage
    }
    const couponDb=await couponModel.create(couponObject)
    if(!couponDb){
        next(new Error('fail to add coupon ',{cause:400}))
    }
    res.status(200).json({message:'added done', couponDb})
}
//////////////////////////////////////////////////////
