/**
* @class hx-audio
* @Author JakeChiu
* @createTime 2016-04-29
* @version 1.0
*/
var hxado = function(id,option){
	//加载框架
	if(typeof(id)=="undefined") return
	function loadutil()
	{
		var script = document.createElement("script");
		var link=document.createElement("link");  
		link.setAttribute("rel", "stylesheet");  
        link.setAttribute("type", "text/css");  
        link.setAttribute("href", "http://imgzq.hexun.com/special_project/audio/css/default.css");  
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", "http://imgzq.hexun.com/special_project/audio/js/zepto.min.js");
		var heads = document.getElementsByTagName("head");
		if (heads.length)
		{
			heads[0].appendChild(script);
			heads[0].appendChild(link);  	
		}
		else
		{
			document.documentElement.appendChild(script);
			document.documentElement.appendChild(link);		
		}
		script.onload =function()
		{
			var scriptAudio = document.createElement("script");
			scriptAudio.setAttribute("type", "text/javascript");
			scriptAudio.setAttribute("src", "http://imgzq.hexun.com/special_project/audio/js/audio.js");
			heads[0].appendChild(scriptAudio);
			scriptAudio.onload =function()
			{
				new hxAudio.js.main(id,option)
			}
		}

	}
	loadutil();
}