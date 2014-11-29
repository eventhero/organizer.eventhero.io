// Generic modules
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    browserify = require('browserify'),
    reactify = require('reactify'),
    source = require('vinyl-source-stream');

// Glob pattern rules here: https://github.com/isaacs/node-glob
var config = {
    images: {
        src: 'src/client/**/*.png'
    },
    js: {
        main: './src/client/app.jsx',
        src: 'src/client/**/*.js?'
    },
    css: {
        main: 'src/client/app.scss',
        src: 'src/client/*.scss'
    },
    html: {
        src: 'src/client/index.html'
    }
};

gulp.task('clean', function() {
    // Nuke the whole dev and dist folders and its content
    return gulp.src(['dev', 'dist'], { read: false })
        .pipe(plugins.rimraf({ force: true }));
});

gulp.task('dev:js', function() {
    return browserify(config.js.main)
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dev/js'));
});

gulp.task('dev:css', function() {
    return gulp.src(config.css.main) // only top level scss files get compiled, other get @included
        .pipe(plugins.sass({ errLogToConsole: true })) // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
        .pipe(plugins.autoprefixer({ browsers: ['last 2 versions'], cascade: false, map: false }))
        .pipe(gulp.dest('dev/css'));
});

gulp.task('dev:images', function() {
    return gulp.src(config.images.src)
        .pipe(gulp.dest('dev/images'));
});

gulp.task('dev:html', function() {
    return gulp.src(config.html.src)
        .pipe(gulp.dest('dev'));
});

gulp.task('dev', ['dev:images', 'dev:css', 'dev:js', 'dev:html'], function() {
});

gulp.task('serve', ['dev'], function() {
    var express = require('express');
    var app = express();
    app.use(express.static('dev'));
    app.listen(4000);
});

gulp.task('watch', ['serve'], function() {
    gulp.watch(config.images.src, ['dev:images']);
    gulp.watch(config.js.src, ['dev:js']);
    gulp.watch(config.css.src, ['dev:css']);
    gulp.watch(config.html.src, ['dev:html']);

    plugins.livereload.listen();
    gulp.watch(['dev/**/*']).on('change', plugins.livereload.changed);
});

gulp.task('default', ['watch']);

gulp.task('dist:images', ['dev:images'], function() {
    return gulp.src('dev/images/**/*')
        .pipe(plugins.rev())
        //.pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/images'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('dist:js', ['dev:js'], function() {
    return gulp.src('dev/js/*.js')
        .pipe(plugins.rev())
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('dist:css', ['dev:css'], function() {
    return gulp.src('dev/css/*.css')
        .pipe(plugins.rev())
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest('dist/css'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('dist', ['dev:html', 'dist:images', 'dist:css', 'dist:js'], function() {
    return gulp.src(['dist/**/rev-manifest.json', 'dev/**/*.html'])
        .pipe(plugins.revCollector())
        .pipe(gulp.dest('dist'));
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

