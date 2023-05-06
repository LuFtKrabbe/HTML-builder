const fs = require('fs');
const path = require('path');

const pathToFolder = path.dirname(__filename);
const pathToText = path.join(pathToFolder, 'text.txt');

const readStream = fs.createReadStream(pathToText, 'utf-8');

let data = '';

readStream.on('data', chunk => data += chunk);
readStream.on('end', () => process.stdout.write(data));
