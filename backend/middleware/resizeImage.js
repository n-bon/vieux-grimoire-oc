const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message : 'No image found' });
    }

    try {
        const nameWithoutExt = path.parse(req.file.originalname).name.split(' ').join('_');
        const outputFilename = nameWithoutExt + Date.now() + '.webp';
        const outputPath = path.join(__dirname, '..', 'images', outputFilename);
        
        await sharp(req.file.buffer)
            .resize(976, 1190)
            .toFormat('webp')
            .toFile(outputPath);

            req.processedImageFilename = outputFilename;
            next();
    } catch (error) {
        console.error('Image processing failed : ', error);
        res.status(500).json({ error });
    }
};