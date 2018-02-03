<!DOCTYPE html>
<html>
	<head>
		<title>数组</title>
		<?php
			include('../header.php');
		?>
	</head>
	<body>
		<div class="reveal">
			<div class="slides">
				<section>
					<section>
						<h1>数组</h1>
						<p>数组是一段线性分配的内存，通过整数下标计算其偏移以访问元素。</p>
						<p>JavaScript提供的是一种类数组（array-like）特性的对象，它把数组下标变成字符串用其作为属性。它的属性检索和更新的方式与对象一模一样，只不过多一个可以用整数作为其属性名的特性。JavaScript数组通常不会预置值。</p>
					</section>
					<section>
						<ol>
							<li>数组字面量</li>
							<li>长度</li>
							<li>删除</li>
							<li>枚举</li>
							<li>辨别数组</li>
							<li>方法</li>
						</ol>
					</section>
				</section>
				<section>
					<section>
						<h2>数组字面量</h2>
						<p>数组字面量是用一对方括号将多个（逗号分隔）或0个表达式包起来。</p>
					</section>
					<section>
						<pre><code>
var array = ['0','1','2','3','4','5'];
var object = {'0':'0', '1':'1', '2':'2', '3':'3', '4':'4', '5':'5'};
						</code></pre>
						<p>array继承自Array.prototype，而object继承自Object.prototype，array有一个诡异的length属性，还继承了大量的方法。</p>
					</section>
				</section>
				<section>
					<section>
						<h2>长度</h2>
						<p>每个数组都有一个可读写的length属性。如果你用大于或等于当前length的数字作为下标来存储一个元素，那么length值会被增大以容纳新元素，而不会发生越界错误。length属性的值是这个数组的最大整数属性名加上1，不一定等于数组里元素的个数。设置更大的length不会给数组分配更多的空间。而把length设小，将导致所有下标大于等于新length的属性被删除。</p>
					</section>
					<section>
						<pre><code>
var array = ['0','1','2','3','4','5'];
array.length;				// 6

array[1000] = true;
array.length; 				// 1001

array[999];				// undefined

array.length = 3;
array;					// ['0', '1', '2']
						</code></pre>
					</section>
				</section>
				<section>
					<section>
						<h2>删除</h2>
						<p>可以使用delete运算符将元素从数组中移除，而排在被删除元素之后的元素属性名（下标）不变。</p>
					</section>
					<section>
						<pre><code>
var array = ['0','1','2','3','4','5'];
delete array[2];
array;		// ['0', '1', undefined, '3', '4', '5']
						</code></pre>
					</section>
				</section>
				<section>
					<section>
						<h2>枚举</h2>
						<p>for in语句可以用来遍历一个数组中的所有属性，但无法保证属性的顺序，还可能从原型链中得到意外属性。</p>
					</section>
				</section>
				<section>
					<section>
						<h2>辨别数组</h2>
						<p>typeof运算符报告数组的类型是‘object’，可以通过以下方法来判断：</p>
						<pre><code>
if(!Array.isArray){
    Array.isArray = function(array){
        var toString = Object.prototype.toString;
        return toString.apply(array) === '[object Array]';
    };
}
						</code></pre>
					</section>
				</section>
				<section>
					<section>
						<h2>方法</h2>
					</section>
					<section>
						<h3>pop()</h3>
						<h3>push(item...)</h3>
					</section>
					<section>
						<h3>shift()</h3>
						<h3>unshift()</h3>
					</section>
					<section>
						<h3>slice(start, end)</h3>
						<h3>splice(start, deleteCount, item...)</h3>
					</section>
					<section>
						<h3>sort(comparefn)</h3>
						<h3>reverse()</h3>
					</section>
					<section>
						<h3>concat(item...)</h3>
						<h3>join(separator)</h3>
					</section>
				</section>
				<section>
					<h1>再见！</h1>
				</section>
			</div>
		</div>
		<?php
			include('../footer.php');
		?>
	</body>
</html>
