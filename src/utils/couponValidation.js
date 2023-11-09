import { couponModel } from "../../DB/models/coupon.model.js";
import moment from "moment-timezone";
export const isCouponValid=async({couponCode,userId,next}={})=>{
const coupon= await couponModel.findOne( {couponCode })
if(!coupon){
    return next(new Error('please enter a valid coupon code'))
}
if(coupon.couponStatus=='expired'||(moment(coupon.endDate).isBefore(moment()))){
    return next(new Error('coupon is expired', { cause: 400 }))
}
for (const user of coupon.couponAssignedtoUsers  ){
    //console.log(userId)
  //  console.log(user.userId)
if(userId.toString() !== user.userId.toString()){
    return next(
        new Error('this user not assgined for this coupon', { cause: 400 }),
      )
}

if (user.maxUsage<=user.usageCount){
    return next(
        new Error('exceed the max usage for this coupon', { cause: 400 }),
      )
}
}
return true 
}
