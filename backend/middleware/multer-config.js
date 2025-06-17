const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/webp': 'webp'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const nameWithoutExt = path.parse(file.originalname).name.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, nameWithoutExt + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');