var gulp = require('gulp');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

gulp.task("webpack", function (callback) {
    console.log(webpackConfig);
    webpack(Object.create(webpackConfig), function (err, stats) {
        if (err) throw new Error("webpack", err);
        console.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task("watch", function () {
    gulp.watch("../src/js/**/*.js", ['webpack']);
});