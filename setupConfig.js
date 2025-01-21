import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import connectToBloomFilterServerFun from './connectToBloomFilterServer.js';

const execAsync = promisify(exec);
const urlsToBlock = JSON.parse(fs.readFileSync('./dataToReload/urlBlockList.json', 'utf-8'));


const __dirname = dirname(fileURLToPath(import.meta.url));
const configFolderPath = join(__dirname, 'config');
const envContent = `CONNECTION_STRING='mongodb://127.0.0.1:27017/foobar_my_db'
PORT=8080
JWT_SECRET='secret2548567589gtyr'
NODE_ENV='development'
PORT_BLOOM_FILTER=8081
HOST_BLOOM_FILTER='127.0.0.1'
`;

// Function to create a directory if it doesn't exist
async function ensureDirSync(dirPath) {
    try {
        await mkdir(dirPath, { recursive: true });
        console.log(`Directory ${dirPath} has been created!`);
    } catch (err) {
        if (err.code !== 'EEXIST') throw err; // Ignore the error if directory already exists
    }
}

// Function to write content to a file, creating the file if it doesn't exist
async function writeFileAsync(filePath, content) {
    try {
        await writeFile(filePath, content, { flag: 'w' });
        console.log(`File ${filePath} has been saved!`);
    } catch (err) {
        throw err;
    }
}

// Function to check if Node.js and npm are installed
async function checkAndInstallNode() {
    try {
        console.log('Checking npm are installed...');
        const { stdout: npmVersion } = await execAsync('npm -v');
        console.log(`npm is installed: ${npmVersion.trim()}`);
    } catch (err) {
        console.warn('npm is not installed. Installing them now...');
        if (process.platform === 'win32') {
            console.error('Please manually install npm on Windows: https://nodejs.org/');
            throw new Error('npm installation not automated on Windows.');
        } else {
            await execAsync('sudo apt update && sudo apt install -y npm');
            console.log('Node.js and npm have been installed successfully!');
        }
    }
}

// Function to install npm packages
async function installPackage(packageName) {
    try {
        console.log(`Installing ${packageName}...`);
        const { stdout, stderr } = await execAsync(`npm install ${packageName}`);
        if (stderr) {
            console.error(stderr);
        }
        console.log(`${packageName} has been installed successfully!`);
    } catch (err) {
        console.error(`Failed to install ${packageName}:`, err.message);
        throw err;
    }
}

// Main function to orchestrate the setup
async function setupConfigFiles() {
    await checkAndInstallNode();
    await ensureDirSync(configFolderPath);
    await writeFileAsync(join(configFolderPath, '.env'), envContent);
    await writeFileAsync(join(configFolderPath, '.env.local'), envContent);
    await installPackage('jsonwebtoken');
    try {
        console.log("\ntry to add urls to block list:");
        await connectToBloomFilterServerFun.addUrlsToBloomFilter(urlsToBlock);
        console.log("add urls to block list")
    } catch (err) {
        console.log("failed to add urls to block list")
    }
}

setupConfigFiles().catch(console.error);
