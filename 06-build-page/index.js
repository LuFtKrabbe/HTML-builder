const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const pathToCurrentFolder = path.dirname(__filename);
const pathToDistFolder = path.join(pathToCurrentFolder, 'project-dist');

const pathToTemplateFile = path.join(pathToCurrentFolder, 'template.html');
const pathToComponentsFolder = path.join(pathToCurrentFolder, 'components');
const pathToDistIndexFile = path.join(pathToDistFolder, 'index.html');

const pathToAssetsFolder = path.join(pathToCurrentFolder, 'assets');
const pathToDistAssetsFolder = path.join(pathToDistFolder, 'assets');

const pathToStylesFolder = path.join(pathToCurrentFolder, 'styles');
const pathToDistStyleFile = path.join(pathToDistFolder, 'style.css');

async function buildHtml() {

  const obj = {};
  let template = await fsPromises.readFile(pathToTemplateFile, { encoding: 'utf-8' });
  
  await fsPromises.readdir(pathToComponentsFolder, {withFileTypes: true})
    .then((files) => {
      console.log('Next files are written in index.html:');
      for (const file of files) {
        if (file.isFile() && (path.extname(file.name).slice(1) == 'html')) {
          console.log(`- ${file.name}`);
          let fileName = file.name.slice(0, file.name.indexOf('.'));
          obj[`{{${fileName}}}`] = file.name;
        }
      }
    });
  
  for (let key in obj) {
    const pathToCurrentComponent = path.join(pathToComponentsFolder, obj[key]);
    const currentComponent = await fsPromises.readFile(pathToCurrentComponent, { encoding: 'utf-8' });
    template = template.replace(key, currentComponent);
  }
 
  await fsPromises.appendFile(pathToDistIndexFile, template);
}

async function buildCss() {
  const styleWriteStream = fs.createWriteStream(pathToDistStyleFile);

  await fsPromises.readdir(pathToStylesFolder, {withFileTypes: true})
    .then((files) => {
      console.log('Next files are written in bundle.css:');
      for (const file of files) {
        if (file.isFile() && (path.extname(file.name).slice(1) == 'css')) {
          console.log(`- ${file.name}`);
          const pathToCurrentStyleFile = path.join(pathToStylesFolder, file.name);
          const styleReadStream = fs.createReadStream(pathToCurrentStyleFile, 'utf-8');
          styleReadStream.pipe(styleWriteStream);
        }
      }
    });
}

async function copyDir(folderToCopy, folderToPaste) {
  await fsPromises.mkdir(path.join(folderToPaste), { recursive: true });
  await fsPromises.readdir(folderToCopy, {withFileTypes: true})
    .then((files) => {
      for (const file of files) {
        if (file.isDirectory()) {
          copyDir(path.join(folderToCopy, file.name), path.join(folderToPaste, file.name));
        }
        if (file.isFile()) {
          fsPromises.copyFile(path.join(folderToCopy, file.name), path.join(folderToPaste, file.name));
        }
      }
    });
}

fsPromises.rm(pathToDistFolder, { force: true, recursive: true })
  .then(() => fsPromises.mkdir(pathToDistFolder, { recursive: true }))
  .then(() => {
    buildHtml();
    buildCss();
    copyDir(pathToAssetsFolder, pathToDistAssetsFolder);
  });