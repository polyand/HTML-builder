const fs = require('fs/promises');
const path = require('path');

const promiseDeleteFolder = fs.rm(path.join(__dirname, 'files-copy'), { force: true, recursive: true });
promiseDeleteFolder.then(function () {
    const promiseCreateFolder = fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
    promiseCreateFolder.then(copyFiles(''))
})

function copyFiles(way) {
    const promiseReadFolder = fs.readdir(path.join(__dirname, 'files', `${way}`), { withFileTypes: true });
    promiseReadFolder.then(function () {
        for (let i = 0; i < arguments[0].length; i++) {
            if (arguments[0][i].isDirectory()) {
                const promiseCreateSubFolder = fs.mkdir(path.join(__dirname, 'files-copy', way, `${arguments[0][i].name}`), { recursive: true });
                copyFiles(`${way}/${arguments[0][i].name}`)
            } else {
                const wayToFile = path.join(__dirname, 'files', way, arguments[0][i].name);
                const promiseCopyFile = fs.copyFile(wayToFile, path.join(__dirname, 'files-copy', way, arguments[0][i].name));
            }
        }
    });
}