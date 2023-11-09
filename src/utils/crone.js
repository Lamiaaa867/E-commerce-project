import { scheduleJob } from "node-schedule";
import { couponModel } from "../../DB/models/coupon.model.js";
import moment from "moment-timezone";
export const changeCouponStatus=()=>{
    scheduleJob('* * * * * *', async function(){
        const validCoupons=await couponModel.find
        ({couponStatus:'valid'} )
        for (const coupon of validCoupons){
            if(moment(coupon.endDate).isBefore(moment())){
                coupon.couponStatus='expired'
            }
            await coupon.save()
        }
        console.log('cron coupons is run ')
    })
}