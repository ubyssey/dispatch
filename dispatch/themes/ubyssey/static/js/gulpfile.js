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

gulp.task('default', function () {
    return gulp.src('src/article.jsx')
        .pipe(react())
        .pipe(gulp.dest('dist'));
});

gulp.task('comments', function () {
    return gulp.src('src/comments.jsx')
        .pipe(react())
        .pipe(gulp.dest('dist'))
        .pipe(shell('python ../../../../../manage.py collectstatic -i node_modules --noinput'));
});

gulp.task('article', function(){
    return browserify('./src/article.jsx')
        .transform({ global: true }, reactify)
        .bundle()
        .pipe(source('article.js'))
        .pipe(derequire())
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(shell('python ../../../../../manage.py collectstatic -i node_modules --noinput'));
});

gulp.task('static', shell.task('python ../../../../../manage.py collectstatic -i node_modules --noinput'));