const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.header.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'TEMPORARY_SECRET_KEY');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};