const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/book')

//Create
router.post('/', bookCtrl.createBook);

//Read
router.get('/', bookCtrl.readAllBooks);
//update

//delete


module.exports = router;