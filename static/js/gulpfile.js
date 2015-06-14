var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var derequire = require('gulp-derequire');
var argv = require('minimist')(process.argv.slice(2));

var path = {
  DEST: 'dist',
  SRC: './src/',
};

var file;
if(typeof argv.i === 'undefined')
    file = "article";
else
    file = argv.i;

gulp.task('watch', function() {
  var watcher  = watchify(browserify({
    entries: [path.SRC + file + '.js'],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(file + '.js'))
      .pipe(derequire())
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest(path.DEST))
      console.log('Updated');
  })
    .bundle()
    .pipe(source(file + '.js'))
    .pipe(derequire())
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(path.DEST));
});

gulp.task('default', ['watch']);