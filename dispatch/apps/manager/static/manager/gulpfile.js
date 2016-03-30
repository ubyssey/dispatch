var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var derequire = require('gulp-derequire');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var argv = require('minimist')(process.argv.slice(2));
var dispatch = require('./js/dispatch.js');

var path = {
  css: {
    SRC: './css/sass',
    DEST: './css'
  },
  js: {
    SRC: './js/src',
    DEST: './js/dist'
  }
};

var file = argv.i || 'article';
var dev = !!argv.d || false;

var reactTask = function(obj){
    return obj.transform({ global: true }, reactify)
    .bundle()
    .pipe(source(file + '.js'))
    .pipe(derequire())
    .pipe(gulpif(!dev, buffer()))
    .pipe(gulpif(!dev, uglify()))
    .pipe(rename(file + '-' + dispatch.version + '.js'))
    .pipe(gulp.dest(path.js.DEST));
}

gulp.task('watch', function() {
  var watcher  = watchify(browserify({
    entries: [path.js.SRC + '/' + file + '.js'],
    debug: dev,
    cache: {}, packageCache: {}, fullPaths: false
  }));

  return reactTask(watcher.on('update', function () {
    reactTask(watcher);
    console.log('updated');
  }));

});

gulp.task('file', function() {
	browserify({
		entries: [path.js.SRC + '/' + file + '.js'],
		debug: dev,
		cache: {},
		packageCache: {},
		fullPaths: false
	})
	.transform({global: true}, reactify)
	.bundle()
	.pipe(source(file + '.js'))
	.pipe(gulpif(!dev, buffer()))
	.pipe(gulpif(!dev, uglify()))
	.pipe(rename(file + '-' + dispatch.version + '.js'))
	.pipe(gulp.dest(path.js.DEST));
});

gulp.task('list', function(){
    gulp.src(path.js.SRC + '/list.js')
    .pipe(uglify())
    .pipe(gulp.dest(path.js.DEST));
});

gulp.task('sass', function () {
  gulp.src(path.css.SRC + '/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(path.css.DEST));
});

gulp.task('default', ['watch']);
