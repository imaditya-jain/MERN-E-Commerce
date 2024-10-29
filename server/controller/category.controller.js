import Categories from "../models/category.model.js";
import slugify from 'slugify';

export const createCategoryController = async (req, res) => {
    try {
        if (req.method !== 'POST') return res.status(405).json({ message: "Method not allowed", success: false })

        const { name, parentCategory, description, image } = req.body

        if (!name || !parentCategory || !description || !image) return res.status(404).json({ message: "All field required.", success: false })

        const categoryExist = await Categories.findOne({ name })

        if (categoryExist) return res.status(409).json({ message: "You cannot create category with same name.", success: true })

        const newCategory = new Categories({ name, parentCategory, description, image })

        await newCategory.save()

        return res.status(201).json({ message: "Category created successfully.", success: true })

    } catch (error) {
        console.error('Category creation Error', error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getCategoriesController = async (req, res) => {
    try {
        if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed", success: false })

        const categories = await Categories.find()

        return res.status(200).json({ categories, success: true })

    } catch (error) {
        console.error('fetch categories error', error.message)
    }
}

export const getCategoryController = async (req, res) => {
    try {
        if (req.method !== 'GET') return res.status(405).json({ message: "Method not found", success: false })

        const { id } = req.params;

        if (!id) return res.status(404).json({ message: 'Category ID required.', success: false })

        const categoryExist = await Categories.findById(id)

        if (!categoryExist) return res.status(404).json({ message: "Category not found.", success: false })

        return res.status(200).json({ category: categoryExist, success: true })

    } catch (error) {
        console.error('Error while fetching category', error.meesage)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

export const updateCategoryController = async (req, res) => {
    try {
        if (req.method !== "PATCH") return res.status(405).json({ message: "Method not allowed", success: false })

        const { id } = req.params
        const { name, image, description, parentCategory } = req.body

        if (!id) return res.status(400).json({ message: "Category ID is required.", success: true })

        let updatedFields = {};

        if (name) {
            updatedFields.name = name;
            updatedFields.slug = slugify(name, { lower: true, strict: true });
        }
        if (image) updatedFields.image = image
        if (description) updatedFields.description = description
        if (parentCategory) updatedFields.parentCategory = parentCategory

        const updatedCategory = await Categories.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true })

        if (!updatedCategory) return res.status(404).json({ message: "Category not found.", success: false })

        return res.status(200).json({ message: "Category updated successfully.", category: updatedCategory, success: true })

    } catch (error) {
        console.error('Error while updating category', error.message)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        if (req.method !== "DELETE") return res.status(405).json({ message: "Method not allowed", success: false })

        const { ids } = req.body

        if (ids && Array.isArray(ids) && ids.length > 0) {

            const result = await Categories.deleteMany({ _id: { $in: ids } })

            if (result.deletedCount === 0) return res.status(404).json({ message: "No categories found for provided ids" })

            return res.status(200).json({ message: `${result.deletedCount} categories deleted successfully`, success: true })

        } else {
            await Categories.deleteMany({})
            return res.status(200).json({ message: "All categories deleted successfully.", success: false })
        }

    } catch (error) {
        console.error('Error while deleting category', error.message)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}