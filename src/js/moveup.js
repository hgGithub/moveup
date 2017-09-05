/*
*简单插件分装，手机向上滚动实现分页加载。
*data: 2017/06/20
*author: HG
*/
;(function(win, doc, undefined){
	"use strict";

	var MoveUp = function (param) {
		var def = {
			container: document.querySelector("html body"), 
			direction: "up",       //滑动方向，目前只接受"up（上拉）"
			getData: "",           //数据接口对象
			curPage:1,              //当前加载页数
			totalPage: 1,           //数据总页数,绑定该插件时需要初始化
      loadingCallBack: "",    //每次拖拽到底的回调,j加载过程中你要做什么就用这个回调
      loading: "",            //正在加载的dom（div, .class, #id）
      toEnd: "",              //全部加载完的dom（div, .class, #id）
      endCallBack: ""         //全部加载已完成的回调(没有数据可加载了),
		};

		if(!(this instanceof MoveUp)) {return new MoveUp()};

    this.param = this._extend(def, param);
		this._init();
	};

  var cInstance = null; //缓存当前实例，利用闭包原理.

	MoveUp.prototype = {
      _startY: 0,
      _curY: 0,
      _scrollAreaHeight: 0,
      _deviceHeight: 0,
      dataLoadedCom: true,
      _init: function () {
      	var $this = this;
      	cInstance = this;
      	if($this.param.curPage >= $this.param.totalPage) return false;

        //初始化loading和loadEnd,dom状态
        var loadingNode = $this.param.loading,
            loadEnd = $this.param.toEnd;

        loadingNode && (document.querySelector(loadingNode).style.display = "none");
        loadEnd && (document.querySelector(loadEnd).style.display = "none");

        //初始化滚动区域及屏幕窗口高度
      	$this._scrollAreaHeight = $this.param.container.scrollHeight;
      	$this._deviceHeight = window.screen.availHeight * window.devicePixelRatio;

        if (document.addEventListener) {
          $this.param.container.addEventListener('touchstart', $this.tsCallBack, false);
        } else {
          $this.param.container.attachEvent('ontouchstart', $this.tsCallBack);          
        }

        if (document.addEventListener) {
          $this.param.container.addEventListener('touchmove', $this.tmCallBack, false);
        } else {
          $this.param.container.attachEvent('ontouchmove', $this.tmCallBack);
        }
      	
      },
      tsCallBack: function (e) {
        e = e || window.event;

        if (!cInstance) return false; 
        cInstance._startY = e.touches[0].pageY;
      },
      tmCallBack: function (e) {
        e = e || window.event;
        if (!cInstance) return false; 
        if(cInstance.param.direction !== 'up') return false; //下拉暂时不做

        cInstance._curY = e.touches[0].pageY;
        var moveY = cInstance._curY - cInstance._startY; 

        if(moveY < 0){//用户上拉
          cInstance.pullUpAct();

        } else if(moveY > 0){} //下拉，暂时不做后续更新 
      },
	    pullUpAct: function () {
        var $this = this;

        //节流
        setTimeout(function() {
          if ($this.dataLoadedCom) {
              var scrollDis = $this._scrollAreaHeight - $this._deviceHeight,
                  dataLoadPosition = Math.floor(scrollDis * 2 / 3);
                  
              if (document.body.scrollTop >= dataLoadPosition && $this.dataLoadedCom) {
                  $this.dataLoadedCom = false;
                  $this.getBottom();
                  $this.sLoading();
              }
          } 
        }, 200);     		
      },
      getBottom:function () {
      	if(this.param.curPage < this.param.totalPage){
      		this.param.curPage++;
      		this.param.getData && (typeof this.param.getData === 'function') && this.param.getData(this.param.curPage, this.isDataLoaded);
      	}
      },
      sLoading: function () { //数据加载中，dom变化
        var loadingNode = this.param.loading;
        loadingNode && (document.querySelector(loadingNode).style.display = "block");

        var loadingCallBack = this.param.loadingCallBack;
        if (loadingCallBack && typeof loadingCallBack === "function") loadingCallBack();
      },
      sAllLoaded: function () {//全部数据都加载完毕，dom变化
        var loadEnd = cInstance.param.toEnd,
            loadingNode = cInstance.param.loading;

        if (loadEnd && this.param.curPage >= this.param.totalPage) {
          document.querySelector(loadEnd).style.display = "block";
          // document.querySelector(loadingNode).style.display = "none";

          if (document.removeEventListener) {
            this.param.container.removeEventListener('touchstart', this.tsCallBack, false);
            this.param.container.removeEventListener('touchmove', this.tmCallBack, false);
          } else {
            this.param.container.detachEvent('ontouchstart', this.tsCallBack);
            this.param.container.detachEvent('ontouchmove', this.tmCallBack);
          }
        }

      },
      isDataLoaded: function (iscom) {
      	iscom ? cInstance.dataLoadedCom = true : cInstance.dataLoadedCom = false;

        if (!cInstance) return false;
        if (iscom) {
          var loadingNode = cInstance.param.loading;
          if (loadingNode) document.querySelector(loadingNode).style.display = "none";
          
          cInstance.sAllLoaded();
        }
      },
      _extend: function(def, target) {
        var temp = {};

        if (typeof target !== "object" || target.constructor === Array) {
          for (var i in def) {
            temp[i] = def[i];
          }

          return temp;
        } 

        for (var i in def) {
          temp[i] = def[i];
        }

        for (var i in target) {
          temp[i] = target[i];
        }        

        return temp;
      }
	}

	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd){
		define(function(require,exports,module){
			return MoveUp;
		});

	} else if (typeof define === 'function' && typeof define.cmd === 'object' && define.cmd){
		module.exports = MoveUp;
	} else {
		window.MoveUp = MoveUp;
	}

})(window, document); 