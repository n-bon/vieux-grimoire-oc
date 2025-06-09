const express = require('express');

const app = express();


app.use((req, res, next) => {
    res.json({ message : 'Requête bien reçue dans le fichier app.js 2'});
    next();
});

app.use((req, res, next) => {
    res.status(201);
});

module.exports = app;