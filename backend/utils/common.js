const jwt = require('jsonwebtoken');
const {
    constants
} = require('./contsants');

// Token generator
const generateToken = (id) => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: `${constants.tokenExpiryDayOffset}d`
    });
};

const decodeToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error();
    }
};

module.exports = {
    generateToken,
    decodeToken
}