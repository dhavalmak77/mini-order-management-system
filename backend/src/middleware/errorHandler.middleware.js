const errorHandler = (error, req, res, next) => {
	console.log(error)
	const status = error.status ?? 500;
	const message = error.message ?? 'Inetrnal server error';

	return res.status(status).json({ message, stack: error.stack });
};

export default errorHandler;