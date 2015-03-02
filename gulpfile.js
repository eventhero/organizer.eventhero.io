// Generic modules
var gulp = require('gulp');

var gulper = require('asset-gulper')({
    currentDir: __dirname,
    app: './src/client',
    main: 'app.jsx',
    vendor: ["jquery", "bootstrap", "react", 'react-router', 'react-bootstrap'],
    outputDir: 'public',
    publicPath: '/',
    port: 8080
});
gulper.defineTasks(gulp, ['clean', 'watch', 'compile']);
