const fs = require('fs');
const path = require('path');

const promiseCreateProjectFolder = fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
const promiseDeleteAssetsFolder = fs.promises.rm(path.join(__dirname, 'project-dist', 'assets'), { force: true, recursive: true });
promiseDeleteAssetsFolder.then(function () {
    const promiseCreateAssetsFolder = fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });
    promiseCreateAssetsFolder.then(copyFiles(''))
})

const promiseCreateStyleFile = fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', (err) => {
    if (err) throw err;
});
const writeStyleStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
const promiseStyles = fs.promises.readdir(path.join(__dirname, 'styles'));
promiseStyles.then(async function () {
    for (let i = 0; i < arguments[0].length; i++) {
        const itemFile = path.join(__dirname, 'styles', arguments[0][i]);
        const extOfFile = path.extname(itemFile).slice(1);
        if (extOfFile === 'css') {
            const readStream = fs.createReadStream(itemFile);
            readStream.pipe(writeStyleStream, { end: false });
            await new Promise(resolve => readStream.on('close', resolve));
            writeStyleStream.write('\n\n');
        }
    }
});

const readStreamHTML = fs.createReadStream(path.join(__dirname, 'template.html'));
readStreamHTML.on('data', (text) => {
    const componentsFiles = fs.promises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
    componentsFiles.then(function (componentFiles) {
        let bufferString = text.toString();
        const components = getFileName(componentFiles);
        components.forEach(component => {
            const pos = bufferString.indexOf(`{{${component}}}`);
            if (pos != -1) {
                const replacer = fs.createReadStream(path.join(__dirname, `components/${component}.html`));
                replacer.on('data', (replaceText) => {
                    bufferString = bufferString.replace(`{{${component}}}`, `${replaceText.toString()}`);
                    const promiseCreateHTMLFile = fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), bufferString, (err) => {
                        if (err) throw err;
                    });
                });
            }
        });
    });
});

function copyFiles(way) {
    const promiseReadAssetsFolder = fs.promises.readdir(path.join(__dirname, 'assets', `${way}`), { withFileTypes: true });
    promiseReadAssetsFolder.then(function () {
        for (let i = 0; i < arguments[0].length; i++) {
            if (arguments[0][i].isDirectory()) {
                const promiseCreateAssetsSubFolder = fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets', way, `${arguments[0][i].name}`), { recursive: true });
                copyFiles(`${way}/${arguments[0][i].name}`)
            } else {
                const wayToFile = path.join(__dirname, 'assets', way, arguments[0][i].name);
                const promiseCopyFile = fs.promises.copyFile(wayToFile, path.join(__dirname, 'project-dist', 'assets', way, arguments[0][i].name));
            }
        }
    });
}

function getFileName() {
    let res = [];
    for (let i = 0; i < arguments[0].length; i++) {
        if (arguments[0][i].isDirectory() === false) {
            const wayToFile = path.join(__dirname, 'components', arguments[0][i].name);
            const extOfFile = path.extname(wayToFile).slice(1);
            const currentName = path.basename(wayToFile);
            const pos = currentName.lastIndexOf(extOfFile) - 1;
            const nameOfFile = currentName.slice(0, pos);
            res.push(nameOfFile);
        }
    }
    return res;
}
