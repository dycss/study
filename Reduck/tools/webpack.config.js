/**
 * 组件化webpack配置
 * Created by donaldcen on 2015/12/29 快过年了
 **/

var webpack = require('webpack');
var glob = require('glob');
var Path = require('path');

//基本路径名字配置
var componentsPath = '../components/',
    entryName = 'entry.js';

//计算入口文件路径
var array = glob.sync(componentsPath + '**/' + entryName);
var entryMap = {};
var entryExp = new RegExp('\/([^\/]+)\/' + entryName);
array.forEach(function (filePath) {
    var entryName = filePath.match(entryExp)[1];
    entryMap['entry.' + entryName] = filePath;
});


module.exports = {
    context: componentsPath,
    entry: entryMap,
    output: {
        path: '../dist-webpack/components/',
        filename: '[name].js'
    },
    resolve: {
        //root: "",
        //extensions: ['.js', '.css', '.ejs'],
        alias: {},
        modulesDirectories: ['./node_modules', componentsPath + "common", componentsPath + "lib", componentsPath]
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css"},
            {test: /\.ejs/, loader: "ejs"}//"ejs-loader?variable=data"
        ]
    }
};