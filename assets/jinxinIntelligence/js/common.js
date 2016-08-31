var forwardurl = '';
var host = "http://10.10.1.129:8088/MonitorDevice/";
var userId = "";
var password = "";
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var getDataUrl = host + '/data/doNotNeedSessionAndSecurity_GetData.do';
var saveDataUrl = host + '/data/doNotNeedSessionAndSecurity_SaveData.do';

var nodatamsg = "没有查询到相关数据";
var count =3;

var userinfo;
function getUserInfo(){
var res=cookie_user=window.localStorage.getItem("userinfo");
	if(res ){
		userinfo = $.parseJSON(res) ;
		userId = userinfo.userId;
		password = userinfo.pwd;
	}
	else{
		
	}
	
}
function setUserInfo(userObj){

//	if(userObj != null && userObj != ""){
//		NativeStorage.setItem("userinfo", JSON.stringify(userObj) );
//		alert('setUserInfo'+userObj);
//		alert('setUserInfo store'+NativeStorage.getItem("userinfo"));
//	}
	var storage = window.localStorage;
	if(userObj != null && userObj != ""){

		storage.setItem("userinfo", JSON.stringify(userObj) ) // Pass a key name and its value to add or update that key.

	//	alert('setUserInfo store--'+storage.getItem("userinfo"));
    }
}
function validUser(url){
	getUserInfo();
	if(userinfo == null || userinfo == ""){
		if(url == null){
			url = 'login.htm';
		}

		location.href=url;
	}
}
//function getUserInfo(){
//		var cookie_user=$.cookie('userinfo');
//    	alert(cookie_user);
//    	var sessionInfo = "";
//    	if(cookie_user != undefined && cookie_user != null &&  cookie_user != "" &&  cookie_user != "null" ){
//
//    		sessionInfo =  eval('(' + cookie_user + ')');
//    	}
//	var res = sessionInfo;
//
//	if(res ){
//		//userinfo = eval('(' + res + ')');
//		userinfo =  res ;
//		userId = userinfo.userId;
//		password = userinfo.pwd;
//
//	}
//	else{
//
//	}
//
//}



var userAgent = navigator.userAgent.toLowerCase();
var iphone_type= /iphone|ipad|ipod/;
var android_type = /android/;





function sleep(numberMillis) { 
	var now = new Date(); 
	var exitTime = now.getTime() + numberMillis; 
	while (true) { 
	now = new Date(); 
	if (now.getTime() > exitTime) 
	return; 
	} 
	}
/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 * 
 * return URL参数字符串
 */
var urlEncode = function (param, key, encode) {
  if(param==null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};
var s=["s_province","s_city","s_county"];//三个select的name
var opt0 = ["省份","地级市","市、县级市"];//初始值
function _init_area(){  //初始化函数
	for(i=0;i<s.length-1;i++){
	  document.getElementById(s[i]).onchange=new Function("change("+(i+1)+")");
	}
	change(0);
	
}

function change(v){
	
	var str="";
	
	var ss=document.getElementById(s[v]);
	str = $('#'+s[v-1]+' option:selected') .val()
	//alert(s[v-1]);
	with(ss){
		length = 0;
		options[0]=new Option(opt0[v],opt0[v]);
		if(v && document.getElementById(s[v-1]).selectedIndex>0 || !v){
			var areas = GetArea(str,ss);
		}//end if v
		if(++v<s.length){change(v);}
	}//End with
	
}


var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']

var square = new Sonic({

	width: 100,
	height: 100,

	stepsPerFrame: 4,
	trailLength: 1,
	pointDistance: .01,
	fps: 25,

	fillColor: '#FF7B24',

	setup: function() {
		this._.lineWidth = 10;
	},

	step: function(point, i, f) {

		var progress = point.progress,
			degAngle = 360 * progress,
			angle = Math.PI/180 * degAngle,
			angleB = Math.PI/180 * (degAngle - 180),
			size = i*5;

		this._.fillRect(
			Math.cos(angle) * 25 + (50-size/2),
			Math.sin(angle) * 15 + (50-size/2),
			size,
			size
		);

		this._.fillStyle = '#63D3FF';

		this._.fillRect(
			Math.cos(angleB) * 15 + (50-size/2),
			Math.sin(angleB) * 25 + (50-size/2),
			size,
			size
		);

		if (point.progress == 1) {

			this._.globalAlpha = f < .5 ? 1-f : f;

			this._.fillStyle = '#EEE';

			this._.beginPath();
			this._.arc(50, 50, 5, 0, 360, 0);
			this._.closePath();
			this._.fill();

		}


	},

	path: [
		['line', 40, 10, 60, 90]
	]

});

