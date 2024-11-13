import express from "express";
import { createCategoryController, deleteCategoryController, getCategoriesController, getCategoryController, updateCategoryController } from "../controller/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/create', authMiddleware, createCategoryController)
router.get('/', authMiddleware, getCategoriesController)
router.get('/:id', authMiddleware, getCategoryController)
router.patch('/update/:id', authMiddleware, updateCategoryController)
router.delete('/delete', authMiddleware, deleteCategoryController)

export default router