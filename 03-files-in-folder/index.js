const fs = require('fs');
const path = require('path');

const pathToCurrentFolder = path.dirname(__filename);
const pathToSecretFolder = path.join(pathToCurrentFolder, 'secret-folder');

process.stdout.write('Папка secret-folder содержит следующие файлы:\n');

fs.readdir(pathToSecretFolder, {withFileTypes: true}, (err, files) => {
  for (const file of files) {
    if (file.isFile()) {
      const fileExt = path.extname(file.name).slice(1);
      const fileName = file.name.slice(0, file.name.indexOf('.'));
      const pathToSecretFile = path.join(pathToSecretFolder, file.name);
      fs.stat(pathToSecretFile, (err, stats) => {
        process.stdout.write(`${fileName} - ${fileExt} - ${stats.size/1000} kB\n`);
      });
    }
  }
});