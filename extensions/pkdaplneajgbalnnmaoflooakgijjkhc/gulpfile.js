var replace = require('gulp-replace'),
  argv = require('yargs').argv,
  gulpif = require('gulp-if'),
  gulp = require('gulp'),
  fs = require('fs'),
  jeditor = require("gulp-json-editor");

gulp.task('build', function () {
  var version = JSON.parse(fs.readFileSync('./package.json')).version;
  gulp.src(['js/*.js'])
    .pipe(gulpif(argv.production,replace(/my.environment = '.*';/g, "my.environment = 'lifesizecloud.com';")))
    .pipe(gulpif(argv.beta,replace(/my.environment = '.*';/g, "my.environment = 'lifesizecloudbeta.com';")))
    .pipe(gulpif(argv.dev,replace(/my.environment = '.*';/g, "my.environment = 'lifesizeclouddev.com';")))
    .pipe(gulp.dest('js'));
  gulp.src("./manifest.json")
      .pipe(jeditor({
        'version': version
      }))
      .pipe(gulp.dest("./"));
});