(function beginGulp() {

    var gulp    = require('gulp'),
        less    = require('gulp-less'),
        concat  = require('gulp-concat'),
        path    = require('path');

    gulp.task('less', function beginGulpLess() {

        gulp.src('./less/**/*.less')
            .pipe(less({
                paths: [ path.join(__dirname, 'less') ]
            }))
            .pipe(concat('default.css'))
            .pipe(gulp.dest(path.join(__dirname, 'css')))

    });

    gulp.task('default', [], function() {
        gulp.start('less');
    });

})();