var gulp = require('gulp');
var gutil = require('gulp-util');

var gulper = require('asset-gulper')({
    currentDir: __dirname,
    app: './src/client',
    main: 'app.jsx',
    vendor: ["jquery", "bootstrap", "react", 'react-router', 'react-bootstrap'],
    outputDir: 'public',
    publicPath: '/',
    logger: gutil.log
});


gulp.task('clean', function(callback){
    gulper.clean(callback);
});

gulp.task('compile', function(callback) {
    gulper.compile(callback);
});

gulp.task('watch', function(callback){
    gulper.watch({port: 8080}, callback);
});

gulp.task('default', ['watch']);
