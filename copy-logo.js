import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = 'C:\\Users\\Jerry\\.gemini\\antigravity-ide\\brain\\0fc7732b-a67a-442f-a5a0-a0d96f36f1c4\\arena_of_legends_logo_1788802910552.jpg';
const destPath = path.join(__dirname, 'public', 'logo.png');
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');

fs.copyFileSync(sourcePath, destPath);
fs.copyFileSync(sourcePath, faviconPath);
console.log('Logo copied successfully!');
