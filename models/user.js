import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    friends: [{
        friendId: { type: Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'approved', 's-pending'], default: 'pending' }
    }]
}
);

const User = mongoose.model('User', userSchema, 'users');
export default User;