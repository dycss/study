/**
 * 组件化webpack配置
 * Created by donaldcen on 2015/12/29 快过年了
 **/

var webpack = require('webpack');
var glob = require('glob');
var Path = require('path');


//基本路径名字配置
var componentsPath = './components/',
    outPath = './dist-webpack/components/',
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
    //context: Path.join(__dirname, './'),
    entry: entryMap,
    output: {
        path: outPath,
        filename: '[name].js'
    },
    resolve: {
        //root: Path.join(__dirname, './'),
        extensions: ['', '.js', '.css', '.ejs'],
        alias: {},
        modulesDirectories: [Path.join(__dirname, 'node_modules'), Path.join(__dirname, componentsPath,"common"), Path.join(__dirname, componentsPath,"lib"), Path.join(__dirname, componentsPath)]
    },
    resolveLoader: {
        //root: Path.join(__dirname, './')
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style-loader!css-loader"},
            {test: /\.ejs/, loader: "ejs"},//"ejs-loader?variable=data"
            {test: /\.jsx?$/, loaders: "jsx?harmony"}
        ]
    }
};