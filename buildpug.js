const fs            = require('fs');
const path          = require('path');
const pug           = require('pug');

const sourcePath    = path.join(__dirname, 'source', 'views');
const buildPath     = path.join(__dirname);

fs.readdir(sourcePath, function(error, files) {
    files.forEach((file) => {
        if(!file.startsWith('_') && file.endsWith('.pug')) {
            let filePath = path.join(sourcePath, file);
            let fileName = file.replace('pug','html');
            let newFilePath = path.join(buildPath, fileName);

            let compile = pug.compileFile(filePath);

            let htmlCode = compile({});

            fs.writeFileSync(newFilePath, htmlCode);
        }
    })
})