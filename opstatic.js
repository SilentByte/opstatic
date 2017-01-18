////
//// MIT License
////
//// Copyright (c) 2016 SilentByte <https://silentbyte.com/>
////
//// Permission is hereby granted, free of charge, to any person obtaining a copy
//// of this software and associated documentation files (the "Software"), to deal
//// in the Software without restriction, including without limitation the rights
//// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//// copies of the Software, and to permit persons to whom the Software is
//// furnished to do so, subject to the following conditions:
////
//// The above copyright notice and this permission notice shall be included in all
//// copies or substantial portions of the Software.
////
//// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
//// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
//// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
//// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
////

'use strict';

const path = require('path');
const minimist = require('minimist');

const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const optipng = require('gulp-optipng');

const args = minimist(process.argv.slice(2));

// OpStatic Entry Point.
(function() {
    args.i = args.i ? args.i : args._[0];
    args.o = args.o ? args.o : args._[1];

    if(!args.i || !args.o) {
        console.log('OpStatic Static Site Optimizer');
        console.log('');
        console.log('Usage:   node opstatic.js [options] input-dir output-dir');
        console.log('Options: -i   Input directory.');
        console.log('         -o   Output directory.');
        return;
    }

    // Pipe through all files that will not be modified.
    gulp.task('copy:static', function() {
        return gulp.src([
            path.join(args.i, '**/*'),
            '!**/*.html',
            '!**/*.css',
            '!**/*.js',
            '!**/*.png'
        ]).pipe(gulp.dest(args.o));
    });

    // Minify HTML.
    gulp.task('optimize:html', function() {
        return gulp.src(path.join(args.i, '**/*.html'))
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true
            }))
            .pipe(gulp.dest(args.o));
    });

    gulp.task('optimize:css', function() {
        return gulp.src(path.join(args.i, '**/*.css'))
            .pipe(cleancss())
            .pipe(gulp.dest(args.o));
    });

    gulp.task('optimize:js', function() {
        return gulp.src(path.join(args.i, '**/*.js'))
            .pipe(uglify())
            .pipe(gulp.dest(args.o));
    });

    gulp.task('optimize:png', function() {
        return gulp.src(path.join(args.i, '**/*.png'))
            .pipe(optipng(['-o9']))
            .pipe(gulp.dest(args.o));
    });

    // Main Task.
    gulp.task('opstatic', [
        'copy:static',
        'optimize:html',
        'optimize:css',
        'optimize:js',
        'optimize:png'
    ]);

    gulp.start('opstatic');
})();

