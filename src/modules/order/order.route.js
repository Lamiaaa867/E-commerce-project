import { Router } from "express";
import { multerCloudFunction } from "../../services/multer.cloudinary.js";
import { allowedExtension } from "../../utils/allowed.extensions.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import * as orderc from './order.controller.js'
import { isAuth } from "../../middlewares/authentaction.js";
import { orderApisEndpoints } from "./oederAPISendpoints.js";
const router = Router();
router.post('/add',isAuth(orderApisEndpoints.create_order),asynchandler(orderc.createOrder))


export default router;