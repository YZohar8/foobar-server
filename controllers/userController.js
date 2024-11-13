import userServices from '../services/userServices.js'

const registerUser = async (req, res) => {
    try {
        await userServices.registerUser(req.body);
        res.status(201).json({ message: 'User created successfully.' });
    }
    catch (error) {
        if (error.message === 'Email in use.') {
            res.status(400).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export default {
    registerUser
}