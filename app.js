import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import apiRoutes from './routes/api.js'

dotenv.config({ path: path.resolve('config', '.env') });
const server = express();

const corsOptions = {
    origin: /http:\/\/localhost:\d+$/,  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
server.use(express.static('public'));
server.use(express.json());
server.use(cors(corsOptions));


// connect to mongodb
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// send to routes
server.use('/api', apiRoutes);

// run aplliction
server.get('*', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'));
});


// run server
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
