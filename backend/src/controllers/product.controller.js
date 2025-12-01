import asyncHandler from "express-async-handler";
import { validateCreateProduct } from "../lib/validator.js";
import { Product } from "../models/Product.model.js";

/**
 * Get products
 */
const getProducts = asyncHandler(async (req, res) => {
	const page = +req.query.page || 1;
	const limit = +req.query.limit || 10;
	const skip = (page - 1) * limit;

	const products = await Product.find({ createdBy: req.user._id })
		.skip(skip)
		.limit(limit)
		.sort({ createdAt: -1 });

	const totalProducts = await Product.countDocuments({ createdBy: req.user._id });
	const totalPage = Math.ceil(totalProducts / limit);

	return res.status(200).json({
		message: 'OK',
		totalData: totalProducts,
		totalPage,
		currentPage: page,
		limit,
		data: products
	});
});

/**
 * Create product
 */
const createProduct = asyncHandler(async (req, res) => {
	const { error, value: productData } = validateCreateProduct(req.body);
	if (error) {
		return res.status(400).json({
			message: error.details.map(({ message }) => message).join(', ')
		});
	}

	productData.createdBy = req.user._id;
	const product = await Product.create(productData);
	if (!product) {
		return res.status(500).json({ message: 'Error creating product!' });
	}

	return res.status(201).json({ message: 'Product added successfully!' });
});

/**
 * Delete product
 */
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		return res.status(404).json({ message: 'Product not found!' });
	}

	if (product.createdBy.toString() !== req.user._id.toString()) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const deletedProduct = await Product.findByIdAndDelete(req.params.id);
	if (!deletedProduct) {
		return res.status(500).json({ message: 'Error deleting product!' });
	}

	return res.status(200).json({ message: 'Product deleted successfully!' });
});

export { getProducts, createProduct, deleteProduct };