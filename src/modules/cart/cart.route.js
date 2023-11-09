
import { Router } from "express";
const router = Router();
import *  as cartC from  './cart.controller.js'
import { asynchandler } from "../../utils/asyncHandler.js";
import { isAuth } from "../../middlewares/authentaction.js";
router.post ('/add' , isAuth(),asynchandler(cartC.addToCart))
router.delete ('/del' , isAuth(),asynchandler(cartC.deleteFromCart))
export default router;