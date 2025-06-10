const express = require('express');

const app = express();


app.get('/api/books/', (req, res, next) => {
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
});

module.exports = app;