/*
*模块封装实例。
*/
;(function(win, doc, undefined) {
	var moduleTest = function() {
		console.log('you are successful to be call me!');
	};

	//模块以amd对外暴露
	if(typeof define === "function" && typeof define.amd === "object" && define.amd){

		console.log("this is amd mode!");
		define(function(require,exports,module){
			return moduleTest;
		});
	}else if(typeof define === "function" && typeof define.cmd === "object" && define.cmd) {//模块以cmd对外暴露
		
		console.log("this is cmd mode!");
		define(function(require, exports, module) {
			module.exports = moduleTest;
		});
		
	}else{//非模块化加载
		console.log("this is global mode!");
		moduleTest();
	}
})(window, document);