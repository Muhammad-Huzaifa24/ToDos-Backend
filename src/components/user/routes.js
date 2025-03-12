import { Router } from "express";
import { signUp, login, forgotPassword, verifyOTP, resetPassword } from "./controller.js";

const router = Router();

router.post("/login", login); // get all items based on filter
router.post("/signUp", signUp);
router.post("/forgot-password", forgotPassword)
router.post("/verify-otp", verifyOTP)
router.post("/reset-password", resetPassword)


export { router };