import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

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

// Main function to orchestrate the creation of config folder and files
async function setupConfigFiles() {
    await ensureDirSync(configFolderPath);
    await writeFileAsync(join(configFolderPath, '.env'), envContent);
    await writeFileAsync(join(configFolderPath, '.env.local'), envContent);
}

setupConfigFiles().catch(console.error);