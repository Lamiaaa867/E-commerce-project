import { Router } from "express";
import { multerCloudFunction } from "../../services/multer.cloudinary.js";
import { allowedExtension } from "../../utils/allowed.extensions.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import * as cc from './category.controller.js'
import * as categoryvalidators from './category.validation.schema.js'
import subcategoryRouter from '../subcategory/subcategory.routes.js'
import { isAuth } from "../../middlewares/authentaction.js";
const router = Router();
//router.use('/:category_id',subcategoryRouter)
router.post('/create',isAuth(),multerCloudFunction(allowedExtension.Image).single('image')
,asynchandler(cc.createCategory))
router.get('/get',multerCloudFunction(allowedExtension.Image).single('image')
,asynchandler(cc.getallcategories))
//router update 
router.put('/update',isAuth(),multerCloudFunction(allowedExtension.Image).single('image'),
asynchandler(cc.updatecategory))
//delete
router.delete('/del',isAuth(),asynchandler(cc.deleteCategory))
export default router;