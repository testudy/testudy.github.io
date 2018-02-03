document.getElementById('btnTest2').onclick = function(event){
	alert('外联脚本\n欢迎来爱编码学习编程！');
};

(function(){
	var scripts = document.getElementsByTagName('script');
	window.configText = scripts[scripts.length-1].innerText;
}());
