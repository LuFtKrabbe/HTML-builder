const fs = require('fs');
const path = require('path');

const fileName = 'outputData.txt';
const pathToFolder = path.dirname(__filename);
const pathToFile = path.join(pathToFolder, fileName);

const { stdin, stdout } = process;

stdout.write('Приветствую!\n');
stdout.write('Для выхода из записи нажмите сочетание (Ctrl + C) или введите: exit\n');
stdout.write(`Введите строку для записи в файл: ${fileName}\n`);

stdin.on('data', data => {
  fs.appendFile(pathToFile, data.toString(), err => {
    if (err) throw (err.message);
  });
  stdout.write('Введите следующую строку:\n');
  if (data.toString().trim() === 'exit') {
    process.on('exit', () => {
      stdout.write(data);
      stdout.write(`Запись в файл ${fileName} закончена.\n`);
      stdout.write('Доброго времени суток и успехов в изучении Node.js!\n');
    });
    process.exit();
  }
});
