// Generic modules
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

gulp.task('clean', function() {
    return gulp.src('dist/*', { read: false }) // much faster
        .pipe(plugins.rimraf({ force: true }));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('html', function() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
    // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
    return gulp.src('src/scripts/**/*.js')
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function() {
    return gulp.src('src/styles/*.scss') // only top level scss files get compiled
        .pipe(plugins.sass({ errLogToConsole: true })) // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
        .pipe(plugins.autoprefixer({ browsers: ['last 2 versions'], cascade: false, map: false }))
        .pipe(gulp.dest('dist/css/'))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('rev', ['images', 'css', 'js', 'html'], function() {
    // potentially move prod minifying/uglifying/rev here, and leave css/js tasks just to produce .css/.js files for dev
    return gulp.src(['dist/**/*.css', 'dist/**/*.js'])
        .pipe(plugins.rev())
        .pipe(gulp.dest('dist'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist'));
});

// clean is a dependency, and will be run before anything else
gulp.task('build', ['rev'], function() {
    // These tasks will be executed in parallel
    //return gulp.start('images', 'css', 'js', 'html');
});

gulp.task('watch', ['build'], function() {
    gulp.watch('src/scripts/**/*.js', ['js']);
    gulp.watch('src/styles/**/*.scss', ['css']);
    gulp.watch('src/index.html', ['html']);

    plugins.livereload.listen();
    gulp.watch(['dist/**']).on('change', plugins.livereload.changed);
});

gulp.task('default', ['clean']);

// http://www.artandlogic.com/blog/2014/05/error-handling-in-gulp/
// To debug either the stream pipe to debug
//.pipe(plugins.debug({verbose: true, title: 'html'}))
// To handle errors attach error handler to stream
//    .on('error', onError);
//function onError(error){
//    gutil.log(error.message);
//    gutil.log(error);
//}

