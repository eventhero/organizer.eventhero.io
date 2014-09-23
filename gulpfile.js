var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf');

var config = {
    // src: => what to compile, will produce same number of files in dest
    // watch: => what to watch to recompile, usually includes all files
    // dest: => dir where to place compiled files
    css: {
        src: ['src/styles/*.scss'],
        watch: ['src/styles/**/*.scss'],
        dest: 'dist/css/',
    },
    js: {
        src: ['src/scripts/*.js'],
        watch: ['src/scripts/*.js', 'src/scripts/**/*.js'],
        dest: 'dist/js'
    },
    html: {
        src: ['src/index.html'],
        watch: ['src/index.html'],
        dest: 'dist'
    },
    dist: {
        path: 'dist',
        glob: 'dist/**/*'
    }
};

gulp.task('clean', function() {
    return gulp.src(config.dist.glob, { read: false }) // much faster
        .pipe(rimraf());
});

// JSHint task
gulp.task('lint', function() {
    return gulp.src(config.js.src)
        .pipe(jshint())
        // You can look into pretty reporters as well, but that's another story
        .pipe(jshint.reporter('default'));
});

// Browserify task
gulp.task('js', function() {
    // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
    return gulp.src(config.js.src)
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        // Bundle to a single file
        .pipe(concat('bundle.js'))
        // Output it to our dist folder
        .pipe(gulp.dest(config.js.dest));
});

gulp.task('html', function() {
    // Get our index.html
    gulp.src(config.html.src)
        // And put it in the dist folder
        .pipe(gulp.dest(config.html.dest))
        .pipe(refresh(lrserver)); // Tell the lrserver to refresh
});

var embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;

// Set up an express server (but not starting it yet)
var server = express();
// Add live reload
server.use(livereload({port: livereloadport}));
// Use our 'dist' folder as rootfolder
server.use(express.static(config.dist.path));
// Because I like HTML5 pushstate .. this redirects everything back to our index.html
server.all('/*', function(req, res) {
    res.sendFile('index.html', { root: config.dist.path });
});
// Dev task
gulp.task('dev', function() {
    // Start webserver
    server.listen(serverport);
    // Start live reload
    lrserver.listen(livereloadport);
    // Run the watch task, to keep taps on changes
    gulp.run('watch');
});

// Styles task
var sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'), // Automatically add css attribute prefixes for all browsers
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css');

gulp.task('css', function() {
    return gulp.src(config.css.src)
        // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
        .pipe(sass({ errLogToConsole: true }))
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(gulp.dest(config.css.dest))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(config.css.dest))
        .pipe(refresh(lrserver));

});
gulp.task('watch', ['lint'], function() {
    // Watch our scripts
    gulp.watch(config.js.watch, ['lint', 'js']);
    gulp.watch(config.css.watch, ['css']);
    gulp.watch(config.html.watch, ['html']);
});

gulp.task('default', ['watch']);
