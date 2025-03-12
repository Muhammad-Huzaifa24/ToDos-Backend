import { Router } from "express";
import { signUp, login, forgotPassword, verifyOTP, resetPassword, uploadImage } from "./controller.js";
import upload from "../../config/multer.js";
import { authMiddleware } from "../../middleware/auth.middleware.js"

const router = Router();

router.post("/login", login); // get all items based on filter
router.post("/signUp", signUp);
router.post("/forgot-password", forgotPassword)
router.post("/verify-otp", verifyOTP)
router.post("/reset-password", resetPassword)
router.put("/update-avatar", authMiddleware, upload.single("image"), uploadImage)


export { router };