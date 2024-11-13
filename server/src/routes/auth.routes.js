import { Router } from "express";
import { createUser, loginUser, logoutUser, refreshAccessToken, verifyOTP } from "../controller/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(createUser)
router.route('/login').post(loginUser)
router.route('/verify-otp').post(verifyOTP)
router.route('/logout').post(authMiddleware, logoutUser)
router.route('/refresh-token').post(refreshAccessToken)

export default router