import { connect } from 'http2';
import net from 'net'
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('config', '.env') });

const ADD_COMMAND = 1;
const CHECK_COMMAND = 2;
const HOST = process.env.HOST_BLOOM_FILTER;
const PORT = process.env.PORT_BLOOM_FILTER;

const connectToBloomFilter = async (command, urls) => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();


        let currentIndex = 0; 

        const sendNextUrl = () => {
            if (currentIndex >= urls.length) {
                client.end();
                resolve(true); 
                return;
            }

            const url = urls[currentIndex];
            const message = `${command} ${url}`;
            client.write(message);
        };

        client.connect(PORT, HOST, () => {
            sendNextUrl();
        });

        client.on('data', (data) => {
            const response = data.toString().trim();

            if (response === 'true') {
                currentIndex++; 
                sendNextUrl(); 
            } else {
                client.end(); 
                resolve(false);
            }
        });

        client.on('close', () => {
        });

        client.on('error', (err) => {
            console.error('Error:', err.message);
            reject(err);
        });
    });
};

const addUrlsToBloomFilter = async (urls) => {
    const result = await connectToBloomFilter(ADD_COMMAND, urls);
    return result;
}

const checkUrlsToBloomFilter = async (urls) => {
    const result = await connectToBloomFilter(CHECK_COMMAND, urls);
    return !result;
}

const connectToBloomFilterServerFun = {
    checkUrlsToBloomFilter, 
    addUrlsToBloomFilter
}

export default connectToBloomFilterServerFun;