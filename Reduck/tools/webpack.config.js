var webpack = require('webpack');

module.exports = {
    entry: {
        //index: '../src/js/frame/main.js',
        util: '../src/js/util/state.js',
        test: '../src/js/test/index.js'
    },
    output: {
        path: '../dist-webpack/js/',
        filename: '[name].js'
    }
};