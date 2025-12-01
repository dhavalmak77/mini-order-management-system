import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import cors from 'cors';
import { connectToDB } from './config/database.js';
import errorHandler from './middleware/errorHandler.middleware.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
	return res.send('Hello World!');
});

app.use(errorHandler);

app.listen(port, async () => {
	await connectToDB();
	console.log(`Server is listening at PORT: ${port}`);
});