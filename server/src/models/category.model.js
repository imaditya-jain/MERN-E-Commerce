import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Category name is required'],
        },
        slug: {
            type: String,
            unique: true,
            required: true,
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categories',
            default: null,
        },
        description: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            }
        ]
    },
    { timestamps: true }
);

categorySchema.pre('validate', function (next) {
    if (!this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Categories = mongoose.model('Categories', categorySchema);

export default Categories;
