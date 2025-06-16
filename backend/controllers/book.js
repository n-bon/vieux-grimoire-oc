const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const Book = require('../models/book');

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

exports.readAllBooks = (req, res, next) => {
    const books = [
        {
            _id: 'abcd',
            userId: '1234',
            title: 'Le petit prince',
            author: 'de Saint-Exupéry, Antoine',
            imageUrl: 'https://static.livre-rare-book.com/pictures/TBW/16996_2.jpg',
            year: 1943,
            genre: 'Pour enfants',
            ratings : [
                {
                    userId: '3456',
                    grade: 3,
                }
            ],
            averageRating: 3
        },
        {
            _id: 'efgh',
            userId: '3456',
            title: 'Pierre et Jean',
            author: 'de Maupassant, Guy',
            imageUrl: 'https://www.librairie-faustroll.com/21234-home_default/maupassant-guy-de-pierre-et-jean-ollendorff-1888-edition-originale-relie-en-demi-percaline.jpg',
            year: 1888,
            genre: 'Fiction',
            ratings : [
                {
                    userId: '1234',
                    grade: 5,
                }
            ],
            averageRating: 5
        }
    ]
    res.status(200).json(books);
}