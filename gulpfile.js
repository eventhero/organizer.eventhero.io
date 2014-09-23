// Generic modules
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
    livereload = require('gulp-livereload');

// images plugins
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');

// javascript plugins
var jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify');

// css plugins
var sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'), // Automatically add css attribute prefixes for all browsers
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css');


gulp.task('clean', function() {
    return gulp.src('dist/*', { read: false }) // much faster
        .pipe(rimraf());
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('html', function() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
    // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        // .pipe(browserify({ insertGlobals: true, debug: true }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

//var embedlr = require('gulp-embedlr'),
//    refresh = require('gulp-livereload'),
//    lrserver = require('tiny-lr')(),
//    express = require('express'),
//    livereload = require('connect-livereload'),
//    livereloadport = 35729,
//    serverport = 5000;
//
//// Set up an express server (but not starting it yet)
//var server = express();
//// Add live reload
//server.use(livereload({port: livereloadport}));
//// Use our 'dist' folder as rootfolder
//server.use(express.static('dist'));
//// Because I like HTML5 pushstate .. this redirects everything back to our index.html
//server.all('/*', function(req, res) {
//    res.sendFile('index.html', { root: 'dist' });
//});
//// Dev task
//gulp.task('dev', function() {
//    // Start webserver
//    server.listen(serverport);
//    // Start live reload
//    lrserver.listen(livereloadport);
//    // Run the watch task, to keep taps on changes
//    gulp.run('watch');
//});
//
gulp.task('css', function() {
    return gulp.src('src/styles/*.scss') // only top level scss files get compiled
        .pipe(sass({ errLogToConsole: true })) // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false, map: false }))
        .pipe(gulp.dest('dist/css/'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('build', ['clean', 'images', 'css', 'js', 'html'], function(){});

gulp.task('watch', function() {
    // Watch our scripts
    gulp.watch('src/scripts/**/*.js', ['js']);
    gulp.watch('src/styles/**/*.scss', ['css']);
    gulp.watch('src/index.html', ['html']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
//    gulp.watch(['dist/**']).on('change', livereload.changed);
    gulp.watch(['dist/**']).on('change', function(filePath, server) {
        console.log(filePath);
        livereload.changed(filePath, server);
    });

    //    .pipe(refresh(lrserver)); // Tell the lrserver to refresh

});

gulp.task('default', ['build'], function(){});
