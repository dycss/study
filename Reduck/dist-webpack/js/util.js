/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*******************************!*\
  !*** ../src/js/util/state.js ***!
  \*******************************/
/***/ function(module, exports) {

	/**
	 * 状态机
	 * Created by donaldcen on 2015/12/25
	 */
	//(function () {
	
	
	    /**
	     * 状态机
	     * @constructor
	     */
	    function State(status, start) {
	        this.tasks = [];
	        this.index = start || 0;
	        if (typeof status == 'object') {
	
	        } else {
	            this.set(0, status);
	        }
	    }
	
	    State.prototype = {
	        set: function (index, value) {
	            var me = this;
	            if (typeof index == 'object') {
	                Object.keys(index).forEach(function (key) {
	                    me.tasks[key] = index[key];
	                });
	            } else {
	                this.tasks[Number(index)] = value;
	            }
	            return this;
	        },
	        get: function (index) {
	            index = (typeof index != 'undefined') ? index : this.index;
	            return this.tasks[index];
	        },
	        reset: function () {
	            this.index = 0;
	            return this;
	        },
	        next: function () {
	            return this.tasks(++this.index);
	        }
	    };
	
	
	    //if (typeof module == 'object' && module.exports) {
	    //    module.exports = State;
	    //} else {
	    //    return State;
	    //}
	    module.exports = State;
	//})();


/***/ }
/******/ ]);
//# sourceMappingURL=util.js.map