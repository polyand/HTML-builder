const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const promiseCreatFile = fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
    if (err) throw err;
    stdout.write('Please enter text\n');
});

stdin.on('data', data => {
    if (data.toString().trim() == 'exit') {
        stdout.write("Good luck!\n");
        process.exit();
    } else {
        fs.appendFile(path.join(__dirname, 'text.txt'), data, (err) => {
            if (err) throw err;
        });
    }
});

process.on('SIGINT', () => {
    stdout.cursorTo(0);
    stdout.write("Good luck!\n");
    process.exit();
});