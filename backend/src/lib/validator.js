import Joi from 'joi';

const validateRegister = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required()
	});

	return schema.validate(data);
};

const validateLogin = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required()
	});

	return schema.validate(data);
};

const validateCreateProduct = (data) => {
	const schema = Joi.object({
		name: Joi.string().trim().required(),
		price: Joi.number().required(),
		stock: Joi.number().integer().required()
	});

	return schema.validate(data);
};

export { validateRegister, validateLogin, validateCreateProduct };