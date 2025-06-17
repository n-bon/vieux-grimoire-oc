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
    //if book data is valid : 
    //1-- converting & saving image
    const originalFilename = req.file.filename;
    const inputPath = path.join(__dirname, '..', 'images', originalFilename);
    const filenameWithoutExt = path.parse(originalFilename).name;
    const outputFilename = filenameWithoutExt + '.webp';
    const outputPath = path.join(__dirname, '..', 'images', outputFilename);

    sharp(inputPath)
        .resize(976, 1190)
        .toFormat('webp')
        .toFile(outputPath)
        .then(() => {
            fs.unlink(inputPath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error while trying to delete the original file : ', unlinkErr);
                }
            });
            //2-- formatting data
            const imageURL = `${req.protocol}://${req.get('host')}/images/${outputFilename}`;
            const initialRating = parseFloat(bookObject.ratings?.[0]?.grade)
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
            return book.save();
        })
        .then(() => res.status(201).json({ message : "Book created"}))
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//--------------------READ

exports.readAllBooks = (req, res, next) => {
   Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.readOneBook = (req, res, next) => {
    Book.findById(req.params.id).select('+userId')
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

//-----------------DELETE
exports.deleteBook = (req, res, next) => {
    Book.findById(req.params.id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            if (book.userId !== req.auth.userId) {
                return res.status(403).json({ message: 'Action not permitted' });
            }

            const imagePath = path.join(__dirname, '..', 'images', path.basename(book.imageURL));
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Could not delete image : ', err);
                }

                Book.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message : 'Book deleted'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};