var tpl = require('./button.ejs');
var style = require('./style/button.css');
document.write(tpl({text: 'test'}));
console.log(tpl({text: 'test'}));