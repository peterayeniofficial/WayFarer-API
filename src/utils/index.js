import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Utils = {
    // get hash password
    hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    },

    // compare Password
    comparePassword(hashPassword, password) {
        return bcrypt.compareSync(password, hashPassword);
    },

    // check valid email
    checkIsValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    },

    // Generate Token
    generateToken(id) {
        const token = jwt.sign({
            userId: id,
        },
        process.env.SECRET, { expiresIn: '8d' });
        return token;
    },
};

export default Utils;
