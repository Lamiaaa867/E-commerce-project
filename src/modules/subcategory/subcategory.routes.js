import { Router } from "express";
import { multerCloudFunction } from "../../services/multer.cloudinary.js";
import { allowedExtension } from "../../utils/allowed.extensions.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import * as sc from './subcategory.controller.js'
const router = Router({mergeParams:true});
router.post('/subcreate',multerCloudFunction(allowedExtension.Image).single('image')
,asynchandler(sc.createSubCategory))
router.patch('/up',multerCloudFunction(allowedExtension.Image).single('image')
,asynchandler(sc.updatesubcategory))

router.get('/get',asynchandler(sc.getallsubcategories))
router.delete('/del',asynchandler(sc.deleteSubcategory))
export default router;