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

const getUser = async (req, res) => {
    try {
        const user = await userServices.getUserByEmailOrId(req);
        res.status(200).json(user);
    }
    catch (error) {
        if (error.message === 'User not found.') {
            res.status(404).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

const deleteUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await userServices.deleteUser(userId);
        res.status(201).json({result});
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }

}

const updateUser = async (req, res) => {
    const userId = req.user.id;
    const { name, image } = req.body;
     
    try {
        const result = await userServices.updateUser(userId, image, name);
        res.status(201).json({updateUser: result});
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

export default {
    registerUser,
    getUser,
    deleteUser,
    updateUser
}