var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');

var webpack = require('webpack');
var webpackProdConfig = require('./webpack.config.js');
var webpackDevConfig = require('./webpack.dev.config.js');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('webpack:build', ['clean:js'], function(callback) {
  webpack(webpackProdConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }

    gutil.log('[webpack:build]', stats.toString({ colors: true }));

    callback();
  });
});

gulp.task('webpack:build-dev', ['clean:js'], function(callback) {
  webpack(webpackDevConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build-dev', err);
    }

    gutil.log('[webpack:build-dev]', stats.toString({ colors: true }));

    callback();
  });
});

gulp.task('sass:build', ['clean:css'], function() {
  return gulp.src('./src/styles/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('sass:build-dev', ['clean:css'], function() {
  return gulp.src('./src/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('clean:js', function() {
  return gulp.src('./dist/js/', {read: false})
    .pipe(clean());
});

gulp.task('clean:css', function() {
  return gulp.src('./dist/css/', {read: false})
    .pipe(clean());
});

gulp.task('build', ['webpack:build', 'sass:build']);

gulp.task('build-dev', ['webpack:build-dev', 'sass:build-dev']);

gulp.task('default', ['build-dev'], function() {
  gulp.watch(['./src/js/**/*'],     ['webpack:build-dev']);
  gulp.watch(['./src/styles/**/*'], ['sass:build-dev']);
});
