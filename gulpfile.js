const fs            = require('fs');
const spawn         = require('child_process').spawn;
const gulp          = require('gulp');
const sizeRepo      = require('gulp-sizereport');
const imageMin      = require('gulp-imagemin');
const del           = require('del');

const runAsync = (command, args) => new Promise((resolve, reject) => {
    const proc = spawn(command, args).on('error', reject).on('exit', resolve);

    proc.stderr.pipe(process.stderr);
    proc.stdout.pipe(process.stdout);
})

const readFile = (src) => fs.readFileSync(src, { encoding: 'utf-8' });

const npmScript = (name, args = []) => {
    const func = () => runAsync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', name, ...args]);
    func.displayName = 'npm run ' + name;
    return func
}

const cleanPreviousVersion = () => del([ 'assets/**/*','*.html' ]);

const copyAssets = () => gulp.src('source/assets/**/*')
    .pipe(imageMin())
    .pipe(gulp.dest('assets'));

const sizeReport = () => gulp.src([
    'assets/js/*','assets/images/*','assets/css/*'
]).pipe(sizeRepo({ gzip: true, total: true }));

const buildPug = npmScript('pug');

const build = gulp.series(
    cleanPreviousVersion,
    buildPug,
    copyAssets,
    sizeReport
);

module.exports = { build, default: build };