// Generic modules
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    mainBowerFiles = require('main-bower-files');

gulp.task('clean', function() {
    return gulp.src(['dev', 'dist'], { read: false }) // Nuke the whole dev and dist folders and its content
        .pipe(plugins.rimraf({ force: true }));
});

gulp.task('default', ['clean']);

gulp.task('dev:vendor', function() {
    var bowerFiles = mainBowerFiles(),
        jsFilter = plugins.filter('*.js'),
        cssFilter = plugins.filter('*.css');
    return gulp.src(bowerFiles)
        .pipe(jsFilter)
        .pipe(plugins.concat('vendor.js'))
        .pipe(gulp.dest('dev/js'))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(plugins.concat('vendor.css'))
        .pipe(gulp.dest('dev/css'));
});

gulp.task('dev:js', function() {
    return gulp.src(['src/scripts/app.js', 'src/scripts/**/module.js', 'src/scripts/**/*.js'])
        .pipe(plugins.jslint({ sloppy: true, predef: ['angular'] }))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.concat('scripts.js'))
        .pipe(gulp.dest('dev/js'))
});

gulp.task('dev:templates', function () {
    return gulp.src('src/partials/**/*.html')
        .pipe(plugins.angularTemplatecache('templates.js', { standalone: true, root: 'partials' }))
        .pipe(gulp.dest('dev/js'))
});

gulp.task('dev:css', function() {
    return gulp.src('src/styles/*.scss') // only top level scss files get compiled, other get @included
        .pipe(plugins.sass({ errLogToConsole: true })) // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
        .pipe(plugins.autoprefixer({ browsers: ['last 2 versions'], cascade: false, map: false }))
        .pipe(gulp.dest('dev/css'));
});

gulp.task('dev:images', function() {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest('dev/images'));
});

gulp.task('dev:index', function() {
    // concat templates here
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dev'));
});

gulp.task('dev', ['dev:vendor', 'dev:images', 'dev:js', 'dev:css', 'dev:templates', 'dev:index'], function() {
});

gulp.task('serve', ['dev'], function () {
    var express = require('express');
    var app = express();
    app.use(express.static('dev'));
    app.listen(4000);
});

gulp.task('watch', ['serve'], function() {
    gulp.watch('src/images/**/*', ['dev:images']);
    gulp.watch('src/scripts/**/*.js', ['dev:js']);
    gulp.watch('src/styles/**/*.scss', ['dev:css']);
    gulp.watch('src/partials/**/*.html', ['dev:templates']);
    gulp.watch('src/index.html', ['dev:index']);

    plugins.livereload.listen();
    gulp.watch(['dev/**/*']).on('change', plugins.livereload.changed);
});

gulp.task('dist:images', ['dev:images'], function() {
    return gulp.src('dev/images/**/*')
        .pipe(plugins.rev())
        //.pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/images'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('dist:js', ['dev:vendor', 'dev:js', 'dev:templates'], function() {
    return gulp.src('dev/js/*.js')
        .pipe(plugins.rev())
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('dist:css', ['dev:vendor', 'dev:css'], function() {
    return gulp.src('dev/css/*.css')
        .pipe(plugins.rev())
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest('dist/css'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('dist:index', ['dev:index', 'dist:images', 'dist:js', 'dist:css'], function() {
    return gulp.src(['dist/**/rev-manifest.json', 'dev/**/*.html'])
        .pipe(plugins.revCollector())
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['dist:index'], function() {
});

// http://www.artandlogic.com/blog/2014/05/error-handling-in-gulp/
// To debug either the stream pipe to debug
//.pipe(plugins.debug({verbose: true, title: 'html'}))
// To handle errors attach error handler to stream
//    .on('error', onError);
//function onError(error){
//    gutil.log(error.message);
//    gutil.log(error);
//}

