import { Router } from "express";
import { multerCloudFunction } from "../../services/multer.cloudinary.js";
import { allowedExtension } from "../../utils/allowed.extensions.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import * as pc from './product.controller.js'
const router = Router();
router.post('/add',multerCloudFunction(allowedExtension.Image).array('image',3),asynchandler(pc.addProduct))
router.delete('/del',asynchandler(pc.deleteProduct))
router.patch('/update',multerCloudFunction(allowedExtension.Image).array('image',3),asynchandler(pc.updateProduct))
router.get('/get',asynchandler(pc.getallproducts))
router.get('/getwithname',asynchandler(pc.getappproductswithName))
router.get('/list',asynchandler(pc.listproducts))

export default router;