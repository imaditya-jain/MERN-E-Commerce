import express from "express";
import { createCategoryController, deleteCategoryController, getCategoriesController, getCategoryController, updateCategoryController } from "../controller/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/category/create', authMiddleware, createCategoryController)
router.get('/categories', authMiddleware, getCategoriesController)
router.get('/category/:id', authMiddleware, getCategoryController)
router.patch('/category/update/:id', authMiddleware, updateCategoryController)
router.delete('/categories/delete', authMiddleware, deleteCategoryController)

export default router