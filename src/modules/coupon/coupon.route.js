import { Router } from "express";
const router = Router();
import * as cc from './coupon.controller.js'
import { validationCoreFunction } from "../../middlewares/validation.js";
import { addCouponSchema } from "./coupon.validation.schema.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import { isAuth } from "../../middlewares/authentaction.js";
router.post('/add',isAuth(),validationCoreFunction(addCouponSchema),
asynchandler(cc.addCoupon))
export default router