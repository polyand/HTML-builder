const fs = require('fs/promises');
const path = require('path');

const promise = fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
promise.then(function () {
    for (let i = 0; i < arguments[0].length; i++) {
        if (arguments[0][i].isDirectory() === false) {
            const wayToFile = path.join(__dirname, 'secret-folder', arguments[0][i].name);
            const extOfFile = path.extname(wayToFile).slice(1);
            const currentName = path.basename(wayToFile);
            const pos = currentName.lastIndexOf(extOfFile) - 1;
            const nameOfFile = currentName.slice(0, pos);
            const subPromise = fs.stat(wayToFile);
            subPromise.then(function () {
                sizeOfFile = arguments[0].size;
                process.stdout.write(`${nameOfFile} - ${extOfFile} - ${sizeOfFile / 1024}kb \n`);
            });
        }
    }
});


