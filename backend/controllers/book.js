const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const Book = require('../models/book');

//--------------------CREATE

exports.createBook = (req, res, next) => {    
    if (!req.file) {
        return res.status(400).json({ message: 'No image found' });
    }

    let bookObject;
    try {
        bookObject = JSON.parse(req.body.book);
    } catch (parseError) {
        return res.status(400).json({ message : 'Book data not valid' });
    }
    //check rating
    const initialRating = parseFloat(bookObject.ratings?.[0]?.grade);
    if (isNaN(initialRating) || initialRating < 1 || initialRating > 5 ) {
        return res.status(400).json({ message: 'Grade must be between 1 and 5' });
    }
 
    const imageURL = `${req.protocol}://${req.get('host')}/images/${req.processedImageFilename}`;
    const year = parseInt(bookObject.year);
    const userId = req.auth.userId;

    const book = new Book ({
        userId: userId,
        title: bookObject.title,
        author: bookObject.author,
        imageUrl: imageURL,
        year: year,
        genre: bookObject.genre,
        ratings: [
            { userId: userId, grade: initialRating }
        ],
        averageRating: initialRating
    });
    book.save()
        .then(() => res.status(201).json({ message: "Book created" }))
        .catch(error => res.status(400).json({ error }));
};

exports.rateBook = (req, res, next) => {
    const userId = req.auth.userId;
    const ratingValue = parseInt(req.body.rating, 10);
    //checking grade
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5 ) {
        return res.status(400).json({ message: 'Grade must be between 1 and 5' });
    }
    Book.findById(req.params.id)
        .then(book => {
            //checking book
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            //checking user
            const alreadyRated = book.ratings.some(r => r.userId === userId);
            if (alreadyRated) {
                return res.status(403).json({ message: 'Action not permitted' })
            }

            book.ratings.push({ userId, grade: ratingValue });

            const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
            book.averageRating = total / book.ratings.length;

            book.save()
                .then(updatedBook => res.status(200).json(updatedBook))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//--------------------READ

exports.readAllBooks = (req, res, next) => {
   Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.readOneBook = (req, res, next) => {
    Book.findById(req.params.id)
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.status(200).json(book);
        })
        .catch((error) => res.status(400).json({ error }));
}

exports.readBestRatedBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

//-----------------UPDATE

exports.updateBook = (req, res, next) => {
    const bookId = req.params.id;

    Book.findById(bookId)
        .then(book => {
            //checking if book exists
            if (!book) {
                return res.status(404).json({ message: 'Book not found'});
            }
            //checking user permission
            if (book.userId !== req.auth.userId) {
                return res.status(403).json({ message: 'Action not permitted' })
            }

            let updatedBookData;

            if (req.file && req.processedImageFilename) {
                //if request contains file
                const parsedData = JSON.parse(req.body.book);
                const year = parseInt(parsedData.year);
                updatedBookData = {
                    title: parsedData.title,
                    author: parsedData.author,
                    year: year,
                    genre: parsedData.genre,
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.processedImageFilename}`
                };

                const oldImagePath = path.join(__dirname, '..', 'images', path.basename(book.imageUrl));
                fs.unlink(oldImagePath, err => {
                    if (err) console.error('Could not delete image :', err);
                });

            } else {
                //if request does not contain file
                const year = parseInt(req.body.year)
                updatedBookData = {
                    title: req.body.title,
                    author: req.body.author,
                    year: year,
                    genre: req.body.genre                   
                };
            }
            Book.updateOne ({ _id: bookId }, { $set: updatedBookData })
                .then(() => res.status(200).json({ message: 'Book updated' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//-----------------DELETE
exports.deleteBook = (req, res, next) => {
    Book.findById(req.params.id)
        .then(book => {
            //checking book and user
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            if (book.userId !== req.auth.userId) {
                return res.status(403).json({ message: 'Action not permitted' });
            }
            //delete image
            const imagePath = path.join(__dirname, '..', 'images', path.basename(book.imageUrl));
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Could not delete image : ', err);
                }
                //delete book in mongoDB
                Book.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message : 'Book deleted'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};