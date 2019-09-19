const fs            = require('fs');
const path          = require('path');
const pug           = require('pug');

const config        = require('./config.json');

const sourcePath    = path.join(__dirname, 'source', 'views');
const buildPath     = path.join(__dirname);

fs.readdir(sourcePath, function(error, files) {
    files.forEach((file) => {
        if(!file.startsWith('_') && file.endsWith('.pug')) {
            let filePath = path.join(sourcePath, file);
            let fileName = file.replace('pug','html');
            let newFilePath = path.join(buildPath, fileName);

            let compile = pug.compileFile(filePath);

            let compileOptions = {
                title: config.title,
                description: config.description,

                cdnFontAwesome: config.cdn.fontAwesome,
                cdnBootstrapCss: config.cdn.bootstrapCss,
                cdnBootstrapJs: config.cdn.bootstrapJs,
                cdnJQuery: config.cdn.jQuery,

                buttons: [],

                supportersSmall: config.patreon.small,
                supportersTrue: config.patreon.true,
                supportersNuclear: config.patreon.nuclear
            }
            let buttonKeys = Object.keys(config.buttons);
            buttonKeys.forEach((key) => {
                compileOptions.buttons.push(config.buttons[key]);
            })

            let htmlCode = compile(compileOptions);

            fs.writeFileSync(newFilePath, htmlCode);
        }
    })
})