const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const app = express();
app.use(express.json());

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

//Connecting to mongo database
// /!\ Hidden connection string
mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .then(() => console.log('Connexion to mongoDB OK.'))
    .catch(() => console.log('Connexion to mongoDB KO.'));

//CROSS origin management
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //4 methods mentionned in docs :
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

//----- BOOKS ROUTES
app.use('/api/books', bookRoutes);
//------ USERS ROUTES
app.use('/api/auth', userRoutes);

module.exports = app;