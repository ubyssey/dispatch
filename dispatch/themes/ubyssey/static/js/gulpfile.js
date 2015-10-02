var gulp = require('gulp');
var react = require('gulp-react');
var shell = require('gulp-shell');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var browserify = require('browserify');
var watchify = require('watchify');

var reactify = require('reactify');
var uglify = require('gulp-uglify');
var derequire = require('gulp-derequire');

var gulpif = require('gulp-if');
var argv = require('minimist')(process.argv.slice(2));

var dev = typeof argv.d !== 'undefined';

var collectstatic = 'python ../../../../../manage.py collectstatic -i node_modules --noinput';


gulp.task('default', function () {
    return gulp.src('src/article.jsx')
        .pipe(react())
        .pipe(gulp.dest('dist'));
});

function _processor(path_jsx, path_src) {
    return function() {
        return browserify(path_jsx)
            .transform({ global: true }, reactify)
            .bundle()
            .pipe(source(path_src))
            .pipe(derequire())
            .pipe(gulpif(!dev, buffer()))
            .pipe(gulpif(!dev, uglify()))
            .pipe(gulp.dest('dist'))
            .pipe(shell(collectstatic));
    };
}

gulp.task('search', _processor('./src/search.jsx', 'search.js'));
gulp.task('article', _processor('./src/article.jsx', 'article.js'));
gulp.task('section', _processor('./src/section.js', 'section.js'));

gulp.task('static', shell.task(collectstatic));
