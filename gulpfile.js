var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var preprocess = require('gulp-preprocess');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('build', function () {
    gulp.src('./www/css/ionic.app.min.css')
        .pipe(gulp.dest('./target/css'));
    gulp.src('./www/css/style.css')
        .pipe(gulp.dest('./target/css'));
    gulp.src('./www/img/*')
        .pipe(gulp.dest('./target/img'));
    gulp.src('./www/templates/*')
        .pipe(gulp.dest('./target/templates'));
    gulp.src('./www/voice/*')
        .pipe(gulp.dest('./target/voice'));
    gulp.src('./www/index.html')
        .pipe(preprocess())
        .pipe(gulp.dest('./target'));
    gulp.src('./www/js/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./target/js'));
//    gulp.src('./www/lib/ionic/js/ionic.bundle.min.js')
//        .pipe(gulp.dest('./target/lib/ionic/js'));
//    gulp.src('./www/lib/ionic/js/underscore/underscore-min.js')
//        .pipe(gulp.dest('./target/lib/ionic/js/underscore'));
    gulp.src('./www/lib/**/*')
        .pipe(gulp.dest('./target/lib'));
//    gulp.src('./www/lib/ionic/css/*')
//        .pipe(gulp.dest('./target/lib/ionic/css'));
//    gulp.src('./www/lib/ionic/fonts/*')
//        .pipe(gulp.dest('./target/lib/ionic/fonts'));
});
