var fs      = require('fs');
var path    = require('path');

var gulp    = require('gulp');
var watch   = require('gulp-watch');
var plumber = require('gulp-plumber');
var header  = require('gulp-header');
var rename  = require('gulp-rename');

var less            = require('gulp-less');
var autoprefixer    = require('gulp-autoprefixer');
var cleanCSS        = require('gulp-clean-css');

// Globals

const pkg = JSON.parse(fs.readFileSync('package.json'));

const options = {
    input   : './client/assets/less/*.less',
    output  : './client/public/css',
    suffix  : '.min',
    plumber : function(err){
        if(!process.env.CI){
            console.log(err);
            this.emit('end');
        };
    },
    clean   : {
        format:{
            breaks:{
                afterComment:true
            }
        }
    },
    header  : [
        '/*!',
        ' * <%= name %> v<%= version %> (<%= homepage %>)',
        ' * Copyright 2017-<%= new Date().getFullYear() %> <%= author %>',
        ' * Licensed under the <%= license %> (http://opensource.org/licenses/<%= license %>)',
        ' */',
    '',''].join('\n'),
};

// Default, used by Travis CI

gulp.task('default', ['build-less']);

// Build tasks

gulp.task('build-less', function(){
    return gulp.src(options.input)
        .pipe(plumber(options.plumber))
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(cleanCSS(options.clean))
        .pipe(header(options.header, pkg))
        .pipe(rename({suffix: options.suffix}))
        .pipe(gulp.dest(options.output));
});

// Watcher

gulp.task('watch', function () {
    gulp.watch('./client/assets/less/**/*.less', ['build-less']);
});
