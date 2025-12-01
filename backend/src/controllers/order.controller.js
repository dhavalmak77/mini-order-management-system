import asyncHandler from "express-async-handler";
import { validateCreateProduct } from "../lib/validator.js";
import { Product } from "../models/Product.model.js";
import { Order } from "../models/Order.model.js";

const getOrders = asyncHandler(async (req, res) => {
	const page = +req.query.page || 1;
	const limit = +req.query.limit || 10;
	const skip = (page - 1) * limit;

	let orders = await Order
		// .find({ user: req.user._id })
		.aggregate([
			{
				$match: { user: req.user._id }
			},
			{
				$lookup: {
					from: "products",
					localField: "products.product",
					foreignField: "_id",
					as: "productData"
				}
			},
			{
				$project: {
					_id: 1,
					user: 1,
					orderCost: 1,
					createdAt: 1,
					updatedAt: 1,
					products: 1,
					productData: 1
				}
			},
			// { $sort: { createdAt: -1 } },
			// { $skip: skip },
			// { $limit: limit }
		]);

	orders = orders.map(order => {
		const mergedProducts = order.products.map(p => {
			const productInfo = order.productData.find(el => el._id.toString() === p.product.toString()) || {};
			return {
				product: p.product,
				name: productInfo.name,
				price: p.price,
				quantity: p.quantity,
				createdAt: productInfo.createdAt
			};
		});

		return {
			_id: order._id,
			user: order.user,
			orderCost: order.orderCost,
			createdAt: order.createdAt,
			updatedAt: order.updatedAt,
			products: mergedProducts
		};
	});

	return res.status(200).json({ message: 'OK', data: orders });
});

/**
 * Create order
 */
const createOrder = asyncHandler(async (req, res) => {
	const { products } = req.body;
	if (!products || products.length === 0) {
		return res.status(400).json({ message: "Products are required" });
	}

	const orderProducts = [];
	let orderCost = 0;

	// Validate products
	for (const item of products) {
		const product = await Product.findById(item.product);

		if (!product) {
			return res.status(404).json({ message: `Product ${item.product} not found` });
		}

		if (item.quantity <= 0) {
			return res.status(400).json({ message: `Invalid quantity for product ${product.name}` });
		}

		if (product.stock < item.quantity) {
			return res.status(400).json({
				message: `Insufficient stock for product ${product.name}`
			});
		}

		const itemCost = product.price * item.quantity;
		orderCost += itemCost;

		orderProducts.push({
			product: product._id,
			quantity: item.quantity,
			price: product.price
		});
	}

	// Deduct stock
	for (const item of products) {
		await Product.findByIdAndUpdate(item.product, {
			$inc: { stock: -item.quantity }
		});
	}

	// Create order
	const order = await Order.create({
		user: req.user._id,
		products: orderProducts,
		orderCost
	});

	return res.status(201).json({
		message: "Order created successfully",
		order
	});
});

export { getOrders, createOrder };