// Import bcrypt
const bcrypt = require('bcrypt')
const User = require('../models').User;
const router = require('express').Router();

// Import Joi and the validation file
const { registerValidation } = require('./validation');


// module.exports = {
// 	create(req, res) {
// 		// validate the data
// 		// const error = registerValidation(req.body)
// 		// console.log(error);
// 		// if (error) return res.status(400).send(error);

// 		// check if the user exists
// 		const emailExist = User.findOne({email: req.body.email});
// 		console.log(emailExist)
// 		if(emailExist) return res.status(400).send('Email already exists');

// 		// Hash Passwords
// 		const salt = bcrypt.genSalt();
// 		const hashedPassword = bcrypt.hash(req.body.password, salt)

// 		// create the user
// 		return User
// 		.create({
// 			firstname: req.body.firstname,
// 			lastname: req.body.lastname,
// 			email: req.body.email,
// 			password: hashedPassword
// 		})
// 		.then(user => res.status(201).send(user))
// 		.catch(error => res.status(400).send(error));
// 	},
// 	list(req, res) {
// 		return User
// 		.findAll()
// 		.then(users => res.status(200).send(users))
// 		.catch(error => res.status(400).send(error));
// 	},
// };

module.exports = {
	create(req, res) {
		// validate the data
		if ( !req.body.firstname ||!req.body.lastname || !req.body.email || !req.body.password || !req.body.repeat_password) {
			errors.push({ message: "Please enter all fields" });
			return
		}

		if (req.body.password.length < 6) {
			errors.push({ message: "Password must be a least 6 characters long" });
			return
		}
		if (req.body.password !== req.body.password2) {
			errors.push({ message: "Passwords do not match" });
		}

		// check if the user exists
		const emailExist = User.findOne({email: req.body.email});
		console.log(emailExist)
		if(emailExist) return res.status(400).send('Email already exists');

		// Hash Passwords
		const salt = bcrypt.genSalt();
		const hashedPassword = bcrypt.hash(req.body.password, salt)

		// create the user
		return User
		.create({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			password: hashedPassword
		})
		.then(user => res.status(201).send(user))
		.catch(error => res.status(400).send(error));
	},
	list(req, res) {
		return User
		.findAll()
		.then(users => res.status(200).send(users))
		.catch(error => res.status(400).send(error));
	},
};

