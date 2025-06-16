const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');

//Create (Authentified)
router.post('/', auth, multer, bookCtrl.createBook);

//Read (Public routes)
router.get('/', bookCtrl.readAllBooks);
router.get('/:id', bookCtrl.readOneBook)
//Update

//Delete


module.exports = router;