const fs = require('fs');
const path = require('path');

const promiseCreateStyleFile = fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
    if (err) throw err;
});
const writeStyleStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
const promise = fs.promises.readdir(path.join(__dirname, 'styles'));
promise.then(async function () {
    for (let i = 0; i < arguments[0].length; i++) {
        const itemFile = path.join(__dirname, 'styles', arguments[0][i]);
        const extOfFile = path.extname(itemFile).slice(1);
        if (extOfFile === 'css') {
            const readStream = fs.createReadStream(itemFile);
            readStream.pipe(writeStyleStream, { end: false });
            await new Promise(resolve => readStream.on('close', resolve));
            writeStyleStream.write('\n');
        }
    }
});