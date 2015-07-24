var gulp = require('gulp');
var react = require('gulp-react');

gulp.task('default', function () {
    return gulp.src('src/article.jsx')
        .pipe(react())
        .pipe(gulp.dest('dist'));
});