var gulp = require('gulp');
var react = require('gulp-react');
var shell = require('gulp-shell');

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