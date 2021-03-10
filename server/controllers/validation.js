const Joi = require('joi')

const registerValidation = data =>{

	const schema = Joi.object({
		firstname: Joi.string().min(2).required(),
		lastname: Joi.string(),
		email: Joi.string().min(6).required().email(),
		password: Joi.string()
		.required()
		.min(8)
		// .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8}$'))
		// .label("Password")
		// .messages({
			// "string.pattern.base": `Password must be at least one letter, one number and one special character`,
		// })
		,repeat_password: Joi.ref('password')

	})
	.with('password', 'repeat_password');

	return schema.validate(data)
};

//  To find what type of error Joi is displaying
// console.log(error.error.details.map(errDetail => errDetail.type), error.error);

// ^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8}$

const loginValidation = data =>{

	const schema = Joi.object({
		email: Joi.string().min(6).required().email(),
		password: Joi.string()
		.required()
		.min(8)
		.pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'))
		.label("Password")
		.messages({
			"string.pattern.base": ` Password must be at least one letter, one number and one special character`,
		})
	})

	return schema.validate(data)
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;