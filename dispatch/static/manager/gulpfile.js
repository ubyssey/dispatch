var gulp = require('gulp');

var webpack = require('webpack-stream');
var sass = require('gulp-sass');
var clean = require('gulp-clean');

gulp.task('sass', ['clean-css'], function () {
  return gulp.src('./src/styles/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('webpack', ['clean-js'], function () {
  return gulp.src('./src/js/**/*.jsx')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('clean-css', function () {
  return gulp.src('./dist/css/', {read: false})
    .pipe(clean());
});

gulp.task('clean-js', function () {
  return gulp.src('./dist/js/', {read: false})
    .pipe(clean());
});

gulp.task('default', ['webpack', 'sass']);
