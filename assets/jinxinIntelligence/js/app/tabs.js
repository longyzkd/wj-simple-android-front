//选项切换
function setTab(name,cursel){
    cursel_0=cursel;
    for(var i=1; i<=links_len; i++){
        var tabs = document.getElementById(name+i);
        var tabscontent = document.getElementById("con_"+name+"_"+i);
        if(i==cursel){
            tabs.className="selected";
            tabscontent.style.display="block";
        }
        else{
            tabs.className="";
            tabscontent.style.display="none";
        }
    }
}
function Next(){
    cursel_0++;
    if (cursel_0>links_len)cursel_0=1
    setTab(name_0,cursel_0);
}
var name_0='one';
var cursel_0=1;
//		var ScrollTime=3000;//循环周期，可任意更改（毫秒）
var links_len,iIntervalId;
onload=function(){
    var links = document.getElementById("tab1").getElementsByTagName('li')
    links_len=links.length;
    for(var i=0; i<links_len; i++){
        links[i].onmouseover=function(){
            clearInterval(iIntervalId);
            this.onmouseout=function(){
                iIntervalId = setInterval(Next,ScrollTime);;
            }
        }
    }
    document.getElementById("con_"+name_0+"_"+links_len).parentNode.onmouseover=function(){
        clearInterval(iIntervalId);
        this.onmouseout=function(){
            iIntervalId = setInterval(Next,ScrollTime);;
        }
    }
    setTab(name_0,cursel_0);
    iIntervalId = setInterval(Next,ScrollTime);
}
