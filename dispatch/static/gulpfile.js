var gulp = require('gulp');

var webpack = require('webpack-stream');
var sass = require('gulp-sass');
var clean = require('gulp-clean');

gulp.task('sass', function () {
  return gulp.src('./src/styles/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('webpack', function () {
  return gulp.src('./src/js/**/*.jsx')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('clean', function () {
  return gulp.src('./dist/', {read: false})
    .pipe(clean());
});

gulp.task('default', ['clean', 'webpack', 'sass']);
