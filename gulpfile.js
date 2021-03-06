var gulp = require('gulp');
var sass = require('gulp-sass');
var pleeease = require('gulp-pleeease');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var ejs = require("gulp-ejs");
var plumber = require("gulp-plumber");
var stylus = require('gulp-stylus');
var pug = require('gulp-pug');
var data = require('gulp-data');

// Sass

gulp.task('sass', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError)) // Keep running gulp even though occurred compile error
        .pipe(pleeease({
            autoprefixer: {
                browsers: ['last 2 versions']
            }
        }))
        .pipe(gulp.dest('build/css'))
        .pipe(reload({stream:true}));
});

// stylus

gulp.task('stylus', function() {
    gulp.src(['stylus/**/*.styl', '!' + 'stylus/**/_*.styl'])
        .pipe(plumber())
        .pipe(stylus())
        .pipe(pleeease({
            autoprefixer: {
                browsers: ['last 2 versions']
            }
        }))
        .pipe(gulp.dest('build/css'))
        .pipe(reload({stream:true}));
});

// Js-concat-uglify

gulp.task('js', function() {
    gulp.src(['js/*.js'])
        .pipe(concat('scripts.js'))
        .pipe(uglify({preserveComments: 'some'})) // Keep some comments
        .pipe(gulp.dest('build/js'))
        .pipe(reload({stream:true}));
});

// Imagemin

gulp.task('imagemin', function() {
    gulp.src(['images/**/*.{png,jpg,gif,svg}'])
        .pipe(imagemin({optimizationLevel: 7}))
        .pipe(gulp.dest('build/images'));
});

// ejs

var fs = require('fs');
var json = JSON.parse(fs.readFileSync("site.json")); // parse json
gulp.task("ejs", function() {
    gulp.src(['templates/*.ejs','!' + 'templates/_*.ejs']) // Don't build html which starts from underline
        .pipe(plumber())
        .pipe(ejs(json, {"ext": ".html"}))
        .pipe(gulp.dest('build'))
});

// pug

gulp.task('pug', function() {
    gulp.src(['templates/*.pug', '!' + 'templates/_*.pug'])
        .pipe(plumber())
        .pipe(data(function(file) {
            return require("./site.json");
        }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'));
});

// Static server

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "build/", //　Target directory
            index  : "index.html" // index file
        }
    });
});

// Reload all browsers

gulp.task('bs-reload', function () {
    browserSync.reload();
});

// Task for `gulp` command

gulp.task('default',['browser-sync'], function() {
    gulp.watch('sass/**/*.scss',['sass']);
    gulp.watch('stylus/**/*.styl', ['stylus']);
    gulp.watch('js/*.js',['js']);
    gulp.watch('images/**',['imagemin']);
    gulp.watch("build/*.html", ['bs-reload']);
    gulp.watch(['templates/*.ejs', 'site.json'], ['ejs']);
    gulp.watch(['templates/*.pug', 'site.json'], ['pug']);
});
