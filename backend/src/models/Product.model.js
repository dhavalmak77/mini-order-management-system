import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	price: {
		type: Number,
		required: true,
		min: 0
	},
	stock: {
		type: Number,
		required: true,
		min: 0
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
}, {
	timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export { Product };