import { Router } from "express";
const router = Router();
import * as bc from './brand.controller.js'
import { asynchandler } from "../../utils/asyncHandler.js";
import { multerCloudFunction } from "../../services/multer.cloudinary.js";
import { allowedExtension } from "../../utils/allowed.extensions.js";
router.post ('/add',multerCloudFunction(allowedExtension.Image).single('logo'),asynchandler(bc.addbrand))
router.delete('/del',asynchandler(bc.deletebrand))
router.get('/sort',asynchandler(bc.sortallBrands))
router.get('/get',asynchandler(bc.getallBrands))
router.patch('/update',multerCloudFunction(allowedExtension.Image).single('logo'),asynchandler(bc.updateBrand))
export default router;