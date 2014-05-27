(function beginGulp() {

    var gulp       = require('gulp'),
        less       = require('gulp-less'),
        concat     = require('gulp-concat'),
        jshint     = require('gulp-jshint'),
        path       = require('path');

    gulp.task('less', function beginGulpLess() {

        return gulp.src('./less/**/*.less')
            .pipe(less({
                paths: [path.join(__dirname, 'less')]
            }))
            .pipe(concat('default.css'))
            .pipe(gulp.dest(path.join(__dirname, 'css')))

    });

    gulp.task('lint', function beginGulpLint() {
        return gulp.src(['js/controllers/*.js', 'js/directives/*.js', 'js/Default.js',
                         'server/**/*.js', 'server/default.js'])
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });

    gulp.task('default', [], function() {
        gulp.start('less');
        gulp.start('lint');
    });

})();