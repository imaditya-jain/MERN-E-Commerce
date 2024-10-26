import { Router } from "express";
import { getUserController, loginController, logoutController, refreshTokenController, registerUserController } from "../controller/user.controller.js";
import { authMiddleware } from "../middlewares/index.middleware.js";
const router = Router();

router.post('/register', registerUserController)
router.get('/refresh-token', refreshTokenController)
router.post('/login', loginController)
router.get('/logout', logoutController)
router.get('/auth', authMiddleware, getUserController)

export default router