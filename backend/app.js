const express = require('express');

const app = express();


app.use((req, res) => {
    res.json({ message : 'Requête bien reçue dans le fichier app.js'});
});

module.exports = app;