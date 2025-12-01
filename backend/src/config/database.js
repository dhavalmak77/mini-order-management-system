import 'dotenv/config';
import mongoose from 'mongoose';

const connectToDB = async (req, res) => {
	try {
		await mongoose.connect(process.env.MONDODB_URL);
		console.log('MongoDB is connected!');
	} catch (error) {
		console.error('Error connecting MongoDB', error);
	}
};

export { connectToDB };