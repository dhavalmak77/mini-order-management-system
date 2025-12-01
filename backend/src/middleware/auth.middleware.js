import jwt from 'jsonwebtoken'
import { User } from '../models/User.model.js';

const authMiddleware = async (req, res, next) => {
	let token = req.headers.authorization ?? '';
	token = token.startsWith('Bearer ') ? token.split('Bearer ')[1] : null;
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).select('-password');
		req.user = user;
	} catch (error) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	next();
};

export { authMiddleware };