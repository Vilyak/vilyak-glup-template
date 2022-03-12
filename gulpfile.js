const { src, dest, watch, series, parallel } = require("gulp");
const eslint = require("gulp-eslint");
const sass = require('gulp-sass')(require('sass'));
const sync = require("browser-sync").create();
const htmlmin = require('gulp-htmlmin');
 
function generateCSS() {
    return src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('dist/css'))
        .pipe(sync.stream());
}

function minify() {
    return src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'));
}

function runLinter(cb) {
    return src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format()) 
        .pipe(eslint.failAfterError())
        .on('end', function() {
            cb();
        });
}

function watchFiles(cb) {
    watch('src/scss/**/**.scss', generateCSS);
    watch('src/*.html', minify);
    watch([ '**/*.js', '!node_modules/**'], runLinter);
}


function baseTasks() {
    minify();
    generateCSS();
    runLinter();
}

function browserSync(cb) {
    sync.init({
        server: {
            baseDir: "./src"
        }
    });

    watchFiles();
    watch("./src/**/*").on('change', sync.reload);
}

exports.sync = browserSync;
exports.lint = runLinter;
exports.watch = watchFiles;

exports.default = () => {
    baseTasks();
    browserSync();
};