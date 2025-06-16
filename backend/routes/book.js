const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');

//Create
router.post('/', auth, multer, bookCtrl.createBook);

//Read
router.get('/', bookCtrl.readAllBooks);
//Update

//Delete


module.exports = router;