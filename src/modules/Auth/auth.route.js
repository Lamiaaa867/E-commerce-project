import { Router } from "express";
import { multerCloudFunction } from "../../services/multer.cloudinary.js";
import { allowedExtension } from "../../utils/allowed.extensions.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import * as uc from './auth.controller.js'
const router = Router();
router.post('/add',asynchandler(uc.signUp))
router.get('/confirm/:token',asynchandler(uc.confirmEmail))
router.patch('/login',asynchandler(uc.logIn))
router.get('/forget',asynchandler(uc.forgetPass))
router.get('/reset/:token',asynchandler(uc.resetPassword))
export default router;