var gulp = require('gulp'),
    gutil = require('gulp-util'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf');

var config = {
    // sources: => includes all files that contribute to compiled outcome. We watch these for changes
    // src: => what to compile, will produce same number of files in dest
    // dest: => dir where to place compiled files
    css: {
        sources: ['src/styles/**/*.scss'],
        src: ['src/styles/*.scss'],
        dest: 'dist/css/',
    },
    js: {
        sources: ['src/scripts/*.js', 'src/scripts/**/*.js'],
        src: ['src/scripts/*.js'],
        dest: 'dist/js'
    },
    html: {
        sources: ['src/index.html'],
        src: ['src/index.html'],
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

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'));
});

// Browserify task
gulp.task('js', function() {
    // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
    return gulp.src(config.js.src)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        // .pipe(browserify({ insertGlobals: true, debug: true }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(config.js.dest))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(config.js.dest));
});

gulp.task('html', function() {
    return gulp.src(config.html.src)
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
gulp.task('watch', ['clean', 'js', 'css', 'html'], function() {
    // Watch our scripts
    gulp.watch(config.js.sources, ['js']);
    gulp.watch(config.css.sources, ['css']);
    gulp.watch(config.html.sources, ['html']);
});

gulp.task('default', ['watch']);
