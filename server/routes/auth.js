const router = require('express').Router();
const User = require('../models/user')

router.post('/api/register', (req, res) =>{
	res.send('Register')
})

module.exports = router;