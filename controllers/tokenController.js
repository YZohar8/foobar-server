import tokenServices from '../services/tokenServices.js';

const createToken = async (req, res) => {
    try {
        const token = await tokenServices.authenticateUser(req.body);
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
}

const checkToken = async (req, res) => {
    res.status(200).json({valid:true});
}

export default {
    createToken,
    checkToken
};