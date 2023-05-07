const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const pathToCurrentFolder = path.dirname(__filename);
const pathToStylesFolder = path.join(pathToCurrentFolder, 'styles');
const pathToBundleFolder = path.join(pathToCurrentFolder, 'project-dist');
const pathToBundleFile = path.join(pathToBundleFolder, 'bundle.css');

const output = fs.createWriteStream(pathToBundleFile);

fsPromises.readdir(pathToStylesFolder, {withFileTypes: true})
  .then((files) => {
    console.log('Next files were read and written in bundle.css:');
    for (const file of files) {
      if (file.isFile() && (path.extname(file.name).slice(1) == 'css')) {
        console.log(`- ${file.name}`);
        const pathToCurrentStyleFile = path.join(pathToStylesFolder, file.name);
        const input = fs.createReadStream(pathToCurrentStyleFile, 'utf-8');
        input.pipe(output);
      }
    }
  });