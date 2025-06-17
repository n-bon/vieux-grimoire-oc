const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');

//Create (Authentified)
router.post('/', auth, multer, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

//Read (Public routes)
router.get('/', bookCtrl.readAllBooks);
router.get('/bestrating', bookCtrl.readBestRatedBooks);

//keep this route bellow all other get routes
router.get('/:id', bookCtrl.readOneBook);

//Update

//Delete
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;