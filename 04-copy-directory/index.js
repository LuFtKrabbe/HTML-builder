const fs = require('fs/promises');
const path = require('path');

const folderName = 'files-copy';
const pathToCurrentFolder = path.dirname(__filename);
const pathToFilesFolder = path.join(pathToCurrentFolder, 'files');
const pathToFilesFolderCopy = path.join(pathToCurrentFolder, folderName);

function copyDir() {

  fs.rm(pathToFilesFolderCopy, { force: true, recursive: true })
    .then(() => fs.mkdir(pathToFilesFolderCopy, { recursive: true }))
    .then((pathToFolder) => console.log(`Next files have been copied or updated to ${pathToFolder}:`))
    .then(() => fs.readdir(pathToFilesFolder, {withFileTypes: true}))
    .then((files) => {
      for (const file of files) {
        if (!file.isFile()) {continue;}
        const pathToFile = path.join(pathToFilesFolder, file.name);
        const pathToFileCopy = path.join(pathToFilesFolderCopy, file.name);
        fs.copyFile(pathToFile, pathToFileCopy);
        console.log(`- ${file.name}`);
      }
    });
  
}

copyDir();

