const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/user');


// // Get one user by username
 router.get('/:id', userController.getOneUser);

// // Get all users
// router.get('/', auth, userController.getAllUsers);


module.exports = router;
