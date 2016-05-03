/**
* @class hx-audio
* @Author JakeChiu
* @createTime 2016-04-29
* @version 1.0
*/
if (typeof(hxAudio)=='undefined') {var hxAudio = { lang: {}, params: {} }};
(function(){
	//声明类库
	hxAudio.util={
	/**
	 获取url参数
        *@param {String} string       字符串
	*/
	getUrlParam:function(string){  
    	//构造一个含有目标参数的正则表达式对象  
   		var reg = new RegExp("(^|&)"+ string +"=([^&]*)(&|$)");  
    	//匹配目标参数  
    	var r = window.location.search.substr(1).match(reg);  
    	//返回参数值  
    	if (r!=null) return unescape(r[2]);  
    	return null;  
	},
    /**
	 ajax
        *@param {String} option       字符串数组
	*/
	SetAjax:function(option)
	{
            jQuery.ajax({dataType: "jsonp", type: "get", url:option.urlstr, success: function (str) {
	        option.getresult(str);
            },
	        error: function (msg) {
            option.getresult(msg);
            }
    });
	},
	/**
	 自定义ajax
        *@param {String} url       字符串请求地址
		*@param {String} result    回调函数
	*/
    postAjax:function(url,result)
    {
			if(result!="")
			{
			try{
			var hs=eval(result)
			var option = {urlstr:url,getresult:function(data) {hs(data) }};
			}catch(e)
			{
			var option = {urlstr:url,getresult:function(data) {}};
			}
			}else
			{
			var option = {urlstr:url,getresult:function(data) {}};
			}
			this.SetAjax(option);
     },
	 /**
	 截取字符串
        *@param {String} str       字符串请求地址
		*@param {String} result    回调函数
	*/
	 limit:function(str,num)
	 {
		    var objString = $.trim(str);  
            var objLength = $.trim(str).length;  
	        if(objLength > num){   
            objString = objString.substring(0,num) + "..";  
            }  	 
			return  objString;
	 }
	
}})();

/*audio*/
(function(){
	//audio eval
	hxAudio.js={
		main:function(id,option)
		{
			this.o_id = id;
			this.id = $("#" + id);
			this.i = 0;
			this.iserror = false;
			this.startX = 0;
			this.endX = 0;
			this.intimer=0;
			this.set = {
				autoplay: true, //是否自动播放
				width:'100%',
				height:'32px',
				url:'',
				loop:true
			}
			this.extend(this.set, option)
			if (id.length > 0) {
				this.init();
			}
		}
	}
	hxAudio.js.main.prototype = {
		bindhtml:function()
		{	
			//创建控件
			var _this = this;
			var _lay='<div class="hxaudio" id="hxaudio" style="widht:'+_this.set.width+';height:'+_this.set.height+'"><div class="hxaudio-left hxaudio-vealign-mid"><div class="spinner hxaudio-vealign-box"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div><div class="hxaudio-rit hxaudio-vealign-mid"><div class="hxaudio-r-box hxaudio-vealign-box"><div class="hxaudio-r-l fl" id="nowtime">00.00</div><div class="hxaudio-r-m fl"><div class="hxaudio-line" id="hxaudio_line"><div class="hxaudio-line-l"><div class="hxaudio-r-ico" id="hxaudio_rbtn"></div></div></div></div><div class="hxaudio-r-r fl" id="maxtime">00.00</div></div></div></div><div id="show"></div>';
			_this.id.append(_lay);
		},
		addlineBtnTouch:function()
		{
			//绑定右侧按钮拖拽
			var _this=this;
		    document.getElementById("hxaudio_rbtn").addEventListener("touchstart", _this.touchStart, false);
		    document.getElementById("hxaudio_rbtn").addEventListener("touchmove", _this.touchMove, false);
		    document.getElementById("hxaudio_rbtn").addEventListener("touchend", function(e){
				e.preventDefault();
				var touch = e.changedTouches[0];
				if (parseInt(touch.pageX - $("#hxaudio_line").offset().left) < $("#hxaudio_line").width()) {
					_this.setx(touch.pageX)
				}
			}, false);
		},
		touchStart:function(e)
		{
			var _this=this;
			e.preventDefault();
			var touch = e.touches[0];
		},
		touchMove:function(e)
		{
			var _this=this;
			e.preventDefault();
			var touch = e.touches[0];
			//$("#show").html($("#hxaudio_line").offset().left+"||"+touch)
			//console.log($("#hxaudio_line").width()+"||"+$("#hxaudio_line .hxaudio-line-l").width()+"||"+touch.pageX)
			if($("#hxaudio_line .hxaudio-line-l").width() > 0)
			{
				if(parseInt(touch.pageX-$("#hxaudio_line").offset().left) < $("#hxaudio_line").width())
				{
				$("#hxaudio_line .hxaudio-line-l").css('width',parseInt(touch.pageX-$("#hxaudio_line").offset().left));
				}
			}
		},
		touchEnd:function(e,_this)
		{
			e.preventDefault();
			var touch = e.changedTouches[0];
			if(parseInt(touch.pageX-$("#hxaudio_line").offset().left) < $("#hxaudio_line").width())
			{
				_this.setx(touch.pageX)
			}
		},
		setx:function(pagex)
		{
				var n =  parseFloat($("#hxaudio_line").width() / document.getElementById("NativeAudio").duration).toFixed(2);
				document.getElementById("NativeAudio").currentTime =  parseFloat((pagex-$("#hxaudio_line").offset().left) / n).toFixed(2);
		},
		extend: function( obj1, obj2 ){
			for ( var attr in obj2 ) {
				obj1[ attr ] = obj2[ attr ]
			}
		},
		init:function()
		{
			this.addNativeAudio();
			this.bindhtml();
		},
		audioloaded:function()
		{
			//音乐加载完成后
			var _this =this;
			_this.id.find(".hxaudio-left").html('<p class="hxaudio-l-ico hxaudio-vealign-box"><i class="hxaudio-play"></i></p>')
			if(_this.set.autoplay)
			{
				_this.audioPlay();
			}else
			{
				_this.audioStop();
			}
			_this.addlineBtnTouch();//绑定进度条按钮拖拽
			_this.addAudioBtnclick();//绑定播放按钮
			_this.settime(document.getElementById("NativeAudio").duration,"maxtime");//设置播放时长
			document.getElementById("NativeAudio").addEventListener('ended', function() {
				//播放结束后
				if (!_this.set.loop) {
						document.getElementById("NativeAudio").currentTime = 0;
						_this.audioStop();
				}
			}, false);
			_this.lineclick();//绑定进度条点击
			_this.lineplay();//进度条动画开始
		},
		lineclick:function()
		{
			var _this=this;
			$("#hxaudio_line").click(function(e){
				e.preventDefault();
				//var touch = e.touches[0];
				//console.log(e.pageX);
				if (parseInt(e.pageX - $("#hxaudio_line").offset().left) < $("#hxaudio_line").width()) {
					$("#hxaudio_line .hxaudio-line-l").css('width', parseInt(e.pageX - $("#hxaudio_line").offset().left));
					_this.setx(e.pageX);
				}
			})
		},
		lineplay:function()
		{
			//进度条播放
			var _this=this;
			_this.setinterva();
            _this.intimer = setInterval(function() {
            	//设置进度时长
            	_this.setinterva()
            }, 1000);

		},
		setinterva:function()
		{
			var _this = this;
			var n = _this.parfloatfix($("#hxaudio_line").width() / document.getElementById("NativeAudio").duration);			
			var currentTime = _this.parfloatfix(document.getElementById("NativeAudio").currentTime);
			var nw = _this.parfloatfix(n * currentTime);
			$("#nowtime").html(_this.settime(currentTime, "nowtime"));
			$("#hxaudio_line .hxaudio-line-l").width(nw + "px");
			_this=currentTime = nw = n = null
		},
		parfloatfix:function(tm)
		{
			return parseFloat(tm).toFixed(2);
		},
		addAudioBtnclick:function()
		{
			var _this = this;
			var oBtn = _this.id.find(".hxaudio-left i");
			var audio = document.getElementById("NativeAudio");
			oBtn.click(function() {
				if($(this).hasClass("hxaudio-stop"))
				{
					_this.audioStop();
				}else if($(this).hasClass("hxaudio-play"))
				{
					_this.audioPlay();
				}
			});
			//audio.addEventListener("pause",function(){},false);//暂停
		},
		audioPlay:function()
		{
			this.id.find(".hxaudio-left i").attr("class","hxaudio-stop");
			document.getElementById("NativeAudio").play();
			this.lineplay();
		},
		audioStop:function()
		{
			var _this =this;
			_this.id.find(".hxaudio-left i").attr("class","hxaudio-play");
			document.getElementById("NativeAudio").pause();
			clearInterval(_this.intimer)
		},
		settime:function(time,timePlace)
		{
			//设置时间显示
			var timePlace = $("#" + timePlace);
			//分钟
			var minute = time / 60;
			var minutes = parseInt(minute);
			if (minutes < 10) {
				minutes = "0" + minutes;
			}
			//秒
			var second = time % 60;
			seconds = parseInt(second);	
			if (seconds < 10) {
				seconds = "0" + seconds;
			}
			var allTime = "" + minutes + "" + ":" + "" + seconds + ""
			timePlace.html(allTime);
		},
		addNativeAudio:function()
		{
			//创建原生audio
			var _this =this;
			var oAudio = $("<audio/>");
			oAudio.attr("id","NativeAudio");
			oAudio.attr("src",_this.set.url);
			if(_this.set.autoplay) {oAudio.attr("autoplay","autoplay")}else{oAudio.attr("preload","preload");};
			if(_this.set.loop) oAudio.attr("loop","loop");
			_this.id.append(oAudio);
			document.getElementById("NativeAudio").onloadedmetadata = function(){
				_this.audioloaded();
			}
		}
	};
})();