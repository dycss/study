!function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return z++
}function e(a){return a.match(C)[0]}function f(a){for(a=a.replace(D,"/"),a=a.replace(F,"$1/");a.match(E);)a=a.replace(E,"/");
return a}function g(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||"/"===c?a:a+".js"
}function h(a){var b=u.alias;return b&&w(b[a])?b[a]:a}function i(a){var b,c=u.paths;return c&&(b=a.match(G))&&w(c[b[1]])&&(a=c[b[1]]+b[2]),a
}function j(a){var b=u.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(H,function(a,c){return w(b[c])?b[c]:a
})),a}function k(a){var b=u.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=y(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break
}return c}function l(a,b){var c,d=a.charAt(0);if(I.test(a))c=a;else if("."===d)c=f((b?e(b):u.cwd)+a);
else if("/"===d){var g=u.cwd.match(J);c=g?g[0]+a.substring(1):a}else c=u.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c
}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=j(a),a=g(a);var c=l(a,b);return c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)
}function o(a,b,c){var d=K.createElement("script");if(c){var e=y(c)?c(a):c;e&&(d.charset=e)}p(d,b,a),d.async=!0,d.src=a,P=d,S?R.insertBefore(d,S):R.appendChild(d),P=null
}function p(a,b,c){function d(){a.onload=a.onerror=a.onreadystatechange=null,u.debug||R.removeChild(a),a=null,b()
}var e="onload"in a;e?(a.onload=d,a.onerror=function(){B("error",{uri:c,node:a}),d()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&d()
}}function q(){if(P)return P;if(Q&&"interactive"===Q.readyState)return Q;for(var a=R.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];
if("interactive"===c.readyState)return Q=c}}function r(a){var b=[];return a.replace(V,"").replace(U,function(a,c,d){d&&b.push(d)
}),b}function s(a,b){this.uri=a,this.dependencies=b||[],this.exports=null,this.status=0,this._waitings={},this._remain=0
}if(!a.seajs){var t=a.seajs={version:"2.3.0"},u=t.data={},v=c("Object"),w=c("String"),x=Array.isArray||c("Array"),y=c("Function"),z=0,A=u.events={};
t.on=function(a,b){var c=A[a]||(A[a]=[]);return c.push(b),t},t.off=function(a,b){if(!a&&!b)return A=u.events={},t;
var c=A[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete A[a];return t};
var B=t.emit=function(a,b){var c=A[a];if(c){c=c.slice();for(var d=0,e=c.length;e>d;d++)c[d](b)}return t
},C=/[^?#]*\//,D=/\/\.\//g,E=/\/[^/]+\/\.\.\//,F=/([^:/])\/+\//g,G=/^([^/:]+)(\/.+)$/,H=/{([^{]+)}/g,I=/^\/\/.|:\//,J=/^.*?\/\/.*?\//,K=document,L=location.href&&0!==location.href.indexOf("about:")?e(location.href):"",M=K.scripts,N=K.getElementById("seajsnode")||M[M.length-1],O=e(n(N)||L);
t.resolve=m;var P,Q,R=K.head||K.getElementsByTagName("head")[0]||K.documentElement,S=R.getElementsByTagName("base")[0];
t.request=o;var T,U=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,V=/\\\\/g,W=t.cache={},X={},Y={},Z={},$=s.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6};
s.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=s.resolve(b[d],a.uri);
return c},s.prototype.load=function(){var a=this;if(!(a.status>=$.LOADING)){a.status=$.LOADING;var c=a.resolve();
B("load",c);for(var d,e=a._remain=c.length,f=0;e>f;f++)d=s.get(c[f]),d.status<$.LOADED?d._waitings[a.uri]=(d._waitings[a.uri]||0)+1:a._remain--;
if(0===a._remain)return a.onload(),b;var g={};for(f=0;e>f;f++)d=W[c[f]],d.status<$.FETCHING?d.fetch(g):d.status===$.SAVED&&d.load();
for(var h in g)g.hasOwnProperty(h)&&g[h]()}},s.prototype.onload=function(){var a=this;a.status=$.LOADED,a.callback&&a.callback();
var b,c,d=a._waitings;for(b in d)d.hasOwnProperty(b)&&(c=W[b],c._remain-=d[b],0===c._remain&&c.onload());
delete a._waitings,delete a._remain},s.prototype.fetch=function(a){function c(){t.request(g.requestUri,g.onRequest,g.charset)
}function d(){delete X[h],Y[h]=!0,T&&(s.save(f,T),T=null);var a,b=Z[h];for(delete Z[h];a=b.shift();)a.load()
}var e=this,f=e.uri;e.status=$.FETCHING;var g={uri:f};B("fetch",g);var h=g.requestUri||f;return!h||Y[h]?(e.load(),b):X[h]?(Z[h].push(e),b):(X[h]=!0,Z[h]=[e],B("request",g={uri:f,requestUri:h,onRequest:d,charset:u.charset}),g.requested||(a?a[g.requestUri]=c:c()),b)
},s.prototype.exec=function(){function a(b){return s.get(a.resolve(b)).exec()}var c=this;if(c.status>=$.EXECUTING)return c.exports;
c.status=$.EXECUTING;var e=c.uri;a.resolve=function(a){return s.resolve(a,e)},a.async=function(b,c){return s.use(b,c,e+"_async_"+d()),a
};var f=c.factory,g=y(f)?f(a,c.exports={},c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=$.EXECUTED,B("exec",c),g
},s.resolve=function(a,b){var c={id:a,refUri:b};return B("resolve",c),c.uri||t.resolve(c.id,b)},s.define=function(a,c,d){var e=arguments.length;
1===e?(d=a,a=b):2===e&&(d=c,x(a)?(c=a,a=b):c=b),!x(c)&&y(d)&&(c=r(""+d));var f={id:a,uri:s.resolve(a),deps:c,factory:d};
if(!f.uri&&K.attachEvent){var g=q();g&&(f.uri=g.src)}B("define",f),f.uri?s.save(f.uri,f):T=f},s.save=function(a,b){var c=s.get(a);
c.status<$.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=$.SAVED,B("save",c))
},s.get=function(a,b){return W[a]||(W[a]=new s(a,b))},s.use=function(b,c,d){var e=s.get(d,x(b)?b:[b]);
e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=W[d[f]].exec();c&&c.apply(a,b),delete e.callback
},e.load()},t.use=function(a,b){return s.use(a,b,u.cwd+"_use_"+d()),t},s.define.cmd={},a.define=s.define,t.Module=s,u.fetchedList=Y,u.cid=d,t.require=function(a){var b=s.get(s.resolve(a));
return b.status<$.EXECUTING&&(b.onload(),b.exec()),b.exports},u.base=O,u.dir=O,u.cwd=L,u.charset="utf-8",t.config=function(a){for(var b in a){var c=a[b],d=u[b];
if(d&&v(d))for(var e in c)d[e]=c[e];else x(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),u[b]=c
}return B("config",a),t}}}(this);