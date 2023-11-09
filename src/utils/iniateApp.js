
import { conectDB } from "../../DB/dbConnection.js"
import { globalMiddleWare } from "./asyncHandler.js"
import * as routers from '../modules/indexRoutes.js'
import { changeCouponStatus } from "./crone.js"
export const iniateApp=(app,express)=>{
    const port =process.env.port
    app.use(express.json())
conectDB()
app.use('/cat', routers.categoryRouter)
app.use('/sub',routers.subcategoryRouter)
app.use('/brand',routers.brandRouter)
app.use('/pro',routers.productRouter)
app.use('/coupon',routers.couponRouter)
app.use('/user',routers.userRouter)
app.use('/cart',routers.cartRouter)
app.use('/order',routers.orderRouter)

app.all('*',(req,res,next)=>
res.status(404).json('URL NOT FOUND')
)

app.use(globalMiddleWare)
//changeCouponStatus()
app.listen(port,(req,res,next)=>{
console.log(`app lisening on ${port}`)
})
}