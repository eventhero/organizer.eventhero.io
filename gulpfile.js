// Generic modules
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream');

var gulper = require('asset-gulper')();

process.env.BROWSERIFYSHIM_DIAGNOSTICS = 1

// Glob pattern rules here: https://github.com/isaacs/node-glob
var config = {
    images: {
        src: 'src/client/**/*.png'
    },
    js: {
        libs: './src/client/libs.js',
        main: './src/client/app.js',
        src: 'src/client/**/*.js'
    },
    css: {
        main: 'src/client/app.less',
        src: 'src/client/{app,**/*}.less',
        includePaths: ['node_modules/bootstrap/less']
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

gulp.task('images', function() {
    return gulp.src(config.images.src)
        .pipe(gulp.dest('dev/images'));
});

gulp.task('css', function() {
    return gulp.src(config.css.src) // only top level scss files get compiled, other get @included
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('app.less'))
        .pipe(plugins.less({
            paths: config.css.includePaths
        })) // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
        .pipe(plugins.autoprefixer({ browsers: ['last 2 versions'], cascade: false, map: false }))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('dev/css'));
});

gulp.task('js:libs', function() {
    var opts = {
        noParse: ['jquery', 'bootstrap'],
        debug: true
    };
    return browserify(opts)
        .add(config.js.libs)
        .require(config.js.libs, { expose: 'libs' })
        .bundle()
        .pipe(source('libs.js'))
        .pipe(gulp.dest('dev/js'));
});

function jsBundler(){
    return browserify({
        cache: {},
        packageCache: {},
        fullPaths: true,
        debug: true
    })
        .add(config.js.main)
        .external('libs')
        .transform("reactify")
}

function jsBundle(bundler){
    return bundler.bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('dev/js'));
}

gulp.task('js', function() {
    return jsBundle(jsBundler());
});

gulp.task('html', function() {
    return gulp.src(config.html.src)
        .pipe(gulp.dest('dev'));
});

gulp.task('dev', ['images', 'css', 'js:libs', 'js', 'html'], function() {
});

gulp.task('serve', ['dev'], function() {
    var express = require('express');
    var app = express();
    app.use(express.static('dev'));
    app.listen(4000);
});

gulp.task('livereload', function() {
    plugins.livereload.listen();
    gulp.watch(['dev/**/*']).on('change', plugins.livereload.changed);
});

gulp.task('watch', ['serve', 'livereload'], function() {
    gulp.watch(config.images.src, ['images']);
    gulp.watch(config.css.src, ['css']);
    gulp.watch(config.html.src, ['html']);
    gulp.watch(config.js.src, ['js']);
    //var bundler = watchify(jsBundler());
    //
    //function rebundle() {
    //    console.log("rebundling...");
    //    return jsBundle(bundler);
    //}
    //
    //bundler.on('update', rebundle);
});

gulp.task('default', ['watch']);

gulp.task('dist:images', ['images'], function() {
    return gulp.src('dev/images/**/*')
        .pipe(plugins.rev())
        .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/images'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('dist:js', ['js'], function() {
    return gulp.src('dev/js/*.js')
        .pipe(plugins.rev())
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('dist:css', ['css'], function() {
    return gulp.src('dev/css/*.css')
        .pipe(plugins.rev())
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest('dist/css'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('dist', ['html', 'dist:images', 'dist:css', 'dist:js'], function() {
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

