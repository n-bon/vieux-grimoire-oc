const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const resizeImage = require('../middleware/resizeImage');
const bookCtrl = require('../controllers/book');

//--- Create (Authentified)
router.post('/', auth, multer, resizeImage, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

//--- Read (Public routes)
router.get('/', bookCtrl.readAllBooks);
router.get('/bestrating', bookCtrl.readBestRatedBooks);

//keep this route bellow all other get routes
router.get('/:id', bookCtrl.readOneBook);

//--- Update (Authentified)
router.put('/:id', auth, multer, resizeImage, bookCtrl.updateBook)

//--- Delete (Authentified)
router.delete('/:id', auth, bookCtrl.deleteBook);



module.exports = router;