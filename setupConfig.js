import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __dirname = dirname(fileURLToPath(import.meta.url));
const configFolderPath = join(__dirname, 'config');
const envContent = `CONNECTION_STRING='mongodb://localhost:27017/foobar_my_db'
PORT=8080
JWT_SECRET='secret2548567589gtyr'
NODE_ENV='development'
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
        console.log('Checking if Node.js and npm are installed...');
        const { stdout: nodeVersion } = await execAsync('node -v');
        const { stdout: npmVersion } = await execAsync('npm -v');
        console.log(`Node.js is installed: ${nodeVersion.trim()}`);
        console.log(`npm is installed: ${npmVersion.trim()}`);
    } catch (err) {
        console.warn('Node.js or npm is not installed. Installing them now...');
        if (process.platform === 'win32') {
            console.error('Please manually install Node.js and npm on Windows: https://nodejs.org/');
            throw new Error('Node.js and npm installation not automated on Windows.');
        } else {
            await execAsync('sudo apt update && sudo apt install -y nodejs npm');
            console.log('Node.js and npm have been installed successfully!');
        }
    }
}

// Function to install npm packages
async function installPackage(packageName) {
    try {
        console.log(`Installing ${packageName}...`);
        const { stdout, stderr } = await execAsync(`npm install ${packageName}`);
        console.log(stdout);
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
}

setupConfigFiles().catch(console.error);
