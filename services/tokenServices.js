import User from "../models/user.js";
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

const authenticateUser = async (userData) => {
    // Check if the email exists in the database
    const user = await User.findOne({ email: userData.email });
    if (!user) {
        throw new Error('User not found.');
    }
    // check password
    else if (user.password !== userData.password) {
        throw new Error('Invalid password.');
    }
    const token =  generateToken(user);
    return {token};
}

export default {
    authenticateUser
};