var gulp = require('gulp');

var webpack = require('webpack-stream');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('./src/styles/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('webpack', function() {
  return gulp.src('./src/js/**/*.jsx')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('default', ['webpack', 'sass']);
