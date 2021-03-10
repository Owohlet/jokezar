const bcrypt = require("bcrypt");
const passport = require("passport");
const usersController = require('../controllers').users;
// import routes from auth
const User = require('../models').User;

// Import Joi and the validation file
// const { registerValidation } = require('../controllers/validation');

// Initialize passport for authentication
const initializePassport = require("./passportConfig");
initializePassport(passport);



module.exports = (app) => {


	// Funtion inside passport which initializes passport
	app.use(passport.initialize());
	// Store our variables to be persisted across the whole session. Works with app.use(Session) above
	app.use(passport.session());

	app.get('/api', (req, res) => res.status(200).send({
		message: 'Welcome to the Jokezar API. Prepare to laugh off your boots!',
	}));

	

	app.get('/api/users', usersController.list);

	app.get("/api/users/register", checkAuthenticated, (req, res) => {
		res.json("register.ejs");
	});

	app.get("/api/users/login", checkAuthenticated, (req, res) => {
  		// flash sets a messages variable. passport sets the error message
  		console.log(req.session.flash.error);
  		res.json("login.ejs");
  	});

	app.post('/api/users/register', async (req, res) => {
		
		// var errors = [];
		// validate the data
		if ( !req.body.firstname ||!req.body.lastname || !req.body.email || !req.body.password || !req.body.repeat_password) {
			res.json({ message: "Please enter all fields" });
			return
		}

		if (req.body.password.length < 8) {
			res.json({ message: "Password must be a least 8 characters long" });
			return
		}
		if (req.body.password !== req.body.repeat_password) {
			res.json({ message: "Passwords do not match" });
			return
		};

		// make sure the password is strong
		var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
		if (!strongRegex.test(req.body.password)){
			res.json({message: "Password must contain 1 uppecase, 1 lowercase, 1 numeral and 1 special character"})
			return
		};



		// check if the user exists
		const emailExist = await User.findOne({where: {email: req.body.email}});	
		if (emailExist) return res.json("Email already registered");


		// // Hash Passwords
		const salt = await bcrypt.genSalt();
		hashedPassword = await bcrypt.hash(req.body.password, salt);
		// const hashedPassword = await bcrypt.hash(req.body.password, salt)
		console.log(hashedPassword);
		// res.status(201).send(hashedPassword)

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
	} );

	// app.post( "/api/users/login", passport.authenticate("local", {
	// 	successRedirect: "/users/dashboard",
	// 	failureRedirect: "/users/login",
	// 	// failureFlash: true
	// }),

	app.post('/api/users/login', function(req, res, next){
		passport.authenticate('local',{session: false}, function(err, user, info){
			if (err) { return res.json({ message: "Something happened" }); }
			if (!user) { return res.json({ message: "Incorrect login credentials" }); }
			req.logIn(user, function(err){
				if (err) { return res.json(info);}
				// return res.redirect('/users/' + user.username);
				return res.json({ message: "Logged in...", user: user });
			});
		})(req, res, next);
	});

	// app.post('/api/users/login',
	// 	passport.authenticate('local'),
	// 	function(req, res) {
 //    		// If this function gets called, authentication was successful.
 //    		// `req.user` contains the authenticated user.
 //    		// res.redirect('/users/' + req.user.username);
 //    		res.json({ message: "Welcome" })
 //    	});


	// function(req, res) {
	// 	res.json("you are signed in");
	// };

	app.get("/api/users/dashboard", checkNotAuthenticated, (req, res) => {
		console.log(req.isAuthenticated());
		res.json("dashboard", { user: req.user.name });
	});



	function checkAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return res.redirect("/users/dashboard");
		}
		next();
	}

	function checkNotAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect("/users/login");
	}
};