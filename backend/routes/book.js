const express = require('express');
const router = express.Router();

//Adding auth middleware to routes that require authentification
const auth = require('../middleware/auth');

const bookCtrl = require('../controllers/book');

//Create
router.post('/', auth, bookCtrl.createBook);

//Read
router.get('/', bookCtrl.readAllBooks);
//update

//delete


module.exports = router;