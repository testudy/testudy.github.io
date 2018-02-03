<!DOCTYPE html>
<html>
	<head>
		<title>在HTML中使用JavaScript</title>
		<meta charset="utf-8" />
	</head>
	<body>
        <noscript>
            <p>本页面需要浏览器支持（启用）JavaScript</p>
        </noscript>

		<button id="btnTest1">内联</button>
		<script>
		document.getElementById('btnTest1').onclick = function(){
			alert('内联脚本\n欢迎来爱编码学习编程！');
		};
		</script>

		<button id="btnTest2">外联</button>
		<script src="employ.js">
		config = {name: '爱编码！'};
		</script>

		<button onclick="alert('内嵌脚本\n欢迎来爱编码学习编程！');">内嵌</button>

		<a href="javascript: void window.open();">伪协议</a>
	</body>
</html>
