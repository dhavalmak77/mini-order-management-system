import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validateRegister } from "../lib/validator.js";
import { User } from "../models/User.model.js";
import { Product } from "../models/Product.model.js";

/**
 * Get user
 */
const getUser = asyncHandler(async (req, res) => {
	const user = await User
		// .find({ createdBy: req.user._id })
		.aggregate([
			{
				$match: { _id: req.user._id }
			},
			{
				$lookup: {
					from: "products",
					localField: "_id",
					foreignField: "createdBy",
					as: "products"
				}
			},
			{
				$lookup: {
					from: "orders",
					localField: "_id",
					foreignField: "user",
					as: "orders"
				}
			}
		]);

	return res.status(200).json({ message: 'OK', data: user[0] });
});

/**
 * User login
 */
const userLogin = asyncHandler(async (req, res) => {
	const { error } = validateRegister(req.body);
	if (error) {
		return res.status(400).json({
			message: error.details.map(({ message }) => message).join(', ')
		});
	}

	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		return res.status(400).json({ message: 'User not found!' });
	}

	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		return res.status(400).json({ message: 'Incorrect password!' });
	}

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

	return res.status(200).json({
		message: 'User logged in successfully!',
		token
	});
});

/**
 * User register
 */
const userRegister = asyncHandler(async (req, res) => {
	const { error } = validateRegister(req.body);
	if (error) {
		return res.status(400).json({
			message: error.details.map(({ message }) => message).join(', ')
		});
	}

	const { email, password } = req.body;
	let user = await User.findOne({ email });
	if (user) {
		return res.status(400).json({ message: 'User already exists' });
	}

	user = await User.create({ email, password });
	if (!user) {
		return res.status(500).json({ message: 'Error creating user!' });
	}

	return res.status(201).json({ message: 'User created successfully!' });
});

export { getUser, userLogin, userRegister };