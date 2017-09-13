var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify-es').default;
var gutil = require('gulp-util');
var brfs = require('brfs');

gulp.task('browserify', function() {
  var b = browserify({
    entries: 'index.js',
    standalone: 'CRM.civinky',
    debug: false,
    transform: [brfs]
  });

  return b.bundle()
    .pipe(source('civinky.bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist/'));
});
