import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getAdminUsers, getUser, updateUser } from "../controller/user.controller.js";

const router = Router();

router.route('/update').patch(authMiddleware, updateUser)
router.route('/').get(authMiddleware, getUser)
router.route('/get-admins').get(authMiddleware, getAdminUsers)

export default router