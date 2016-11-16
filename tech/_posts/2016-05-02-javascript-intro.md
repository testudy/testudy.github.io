---
layout: ppt
title: JavaScript简介
tags: 原创 技术
---

<section>
	<section>
		<h1>JavaScript简介</h1>
	</section>
	<section>
        <ul>
            <li>JavaScript是一种直译式脚本语言，是一种动态类型、弱类型、基于原型的语言，内置支持类型</li>
            <li class="fragment" style="margin-top: 24px">JavaScript诞生于1995年，主要用来描述网页的行为。当时它的主要作用是在客户端完成一些基本的验证任务，以代替与服务器端的数据交换。JavaScript的语法源自Java，函数源自Scheme，基于原型的继承源自Self。</li>
            <li class="fragment" style="margin-top: 24px">JavaScript从一个简单的输入验证器发展为一门强大的编程语言，完全出乎人们的预料。它既是一门简单的语言，又是一门非常复杂的语言。学会使用它只需要片刻，真正掌握它则需要数年时间。要想全面理解和掌握JavaScript，关键在于弄清楚它的本质、历史和局限性。</li>
        </ul>
	</section>
</section>
<section>
	<section>
		<h2>JavaScript简史</h2>
	</section>
	<section>
        <ul>
            <li>1995年4月，网景公司招募了Brendan Eich；</li>
            <li class="fragment">1995年9月，NN 2.0 Beta发布，集成LiveScript，12月将其重命名为JavaScript；</li>
            <li class="fragment">1996年8月，NN 3.0发布，集成JavaScript 1.1；</li>
            <li class="fragment">1996年8月，IE 3.0集成名为JScript的JavaScript实现；</li>
            <li class="fragment">1997年6月，<a href="http://www.ecma-international.org/publications/standards/Ecma-262.htm">ECMAScript-262</a>，即ECMAScript标准发布；</li>
            <li class="fragment">1997年10月，IE 4.0集成JScript 3；</li>
            <li class="fragment">1998年6月，标准2.0发布；</li>
            <li class="fragment">1999年12月，标准3.0发布；</li>
            <li class="fragment">2009年12月，标准5.0发布；</li>
            <li class="fragment">2011年6月，标准5.1发布；</li>
            <li class="fragment">2015年6月，标准6.0，即ECMAScript 2015发布；</li>
            <li class="fragment">2016年6月，标准7.0，即ECMAScript 2016发布；</li>
            <li class="fragment">ECMAScript现在每年发布一个新版规范，ECMAScript 2017已经在制定之中……</li>
        </ul>
	</section>

</section>
<section>
	<section>
		<h2>JavaScript实现</h2>
	</section>
	<section>
		<p style="text-align: left">JavaScript和ECMAScript通常被人们用来表达相同的含义，但JavaScript的含义却比ECMA-262规定的要多得多。一个完整的JavaScript实现应该由</p>
        <ol>
            <li class="fragment"><strong>核心</strong>（ECMAScript）</li>
            <li class="fragment"><strong>文档对象模型</strong>（DOM）</li>
            <li class="fragment"><strong>浏览器对象模型</strong>（BOM）</li>
        </ol>
        <p class="fragment roll-in" style="margin-top: 24px; text-align: left">三个不同的部分组成</p>
	</section>
	<section>
		<h3>ECMAScript</h3>
        <ul>
            <li class="fragment roll-in">ECMA-262定义了这门语言的基础，ECMAScript就是对实现该标准规定的语法、类型、语句、关键字、保留字、操作符和对象等组成部分内容的语言描述，浏览器只是实现ECMAScript的宿主之一</li>
            <li class="fragment roll-in">宿主不仅提供基本的ECMAScript实现，同时也会提供该语言的扩展，以便语言与环境之间对接交互，而这些扩展则利用ECMAScript的核心类型和语法提供更多更具体的功能，以便实现对环境的操作。浏览器，Flash和Node都是宿主环境</li>
        </ul>
	</section>
    <section>
        <h2>ECMAScript版本</h2>
        <ul>
            <li class="fragment">ECMAScript的不同版本又称为版次，描述特定实现的ECMA-262规范的第X个版本</li>
            <li class="fragment">ECMA-262的最近一版是第7版，发布于2016年6月</li>
            <li class="fragment">可以去<a href="http://www.ecma-international.org/publications/standards/Ecma-262.htm" target="_blank">ECMA官方主页</a>查看更多信息</li>
        </ul>
        <p></p>
    </section>
    <section>
        <h2>ECMAScript兼容</h2>
        <h4 class="fragment roll-in" style="margin: 25px auto;text-align: left">ECMA-262中给出了ECMAScript兼容的定义：</h4>
        <ul class="fragment">
            <li>支持ECMA-262描述的所有“类型、值、对象、属性、函数以及程序句法和语义”；</li>
            <li>支持Unicode字符标准；</li>
        </ul>
        <h4 class="fragment roll-in" style="margin: 25px auto; text-align: left">兼容的实现还可以进行下列扩展：</h4>
        <ul class="fragment">
            <li>添加ECMA-262没有描述的“更多类型、值、对象、属性和函数”；</li>
            <li>支持ECMA-262没有定义的“程序和正则表达式语法”；</li>
        </ul>
        <p class="fragment roll-in" style="text-align: left">详细信息参见<a href="http://zh.wikipedia.org/wiki/ECMAScript">http://zh.wikipedia.org/wiki/ECMAScript</a>(包括web浏览器ECMAScript的支持)</p>
    </section>

	<section>
		<h2>DOM</h2>
		<p>文档对象模型（<a href="http://zh.wikipedia.org/wiki/DOM">DOM</a>，Document Object Model）是针对XML但经过扩展也用于HTML的应用程序编程接口（API）。DOM把整个页面映射成一个多层节点结构。HTML或XML页面中的每个组成部分都是某种类型的节点，这些节点又包含不同的数据。如下HTML页面所示：</p>
	</section>
	<section>
		<pre><code data-trim contenteditable class="html">
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;Sample Page&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;p&gt;Hello World!&lt;/p&gt;
        &lt;p&gt;一起学习JavaScript！&lt;/p&gt;
    &lt;/body&gt;
&lt;/html&gt;
		</code></pre>
	</section>
    <section>
        <h2>为什么使用DOM</h2>
        <blockquote style="padding: 20px">"在IE4和NN4中分别支持不同的DHTML，Web跨平台的天性被破坏了，而如果任其发展，Web开发领域就会出现技术上的两强割据，浏览器互不兼容的局面。此时，负责指定Web通信标准的W3C开始着手规划DOM。"</blockquote>
    </section>
    <section>
        <h2><a href="https://www.w3.org/DOM/" target="_blank">DOM</a>级别</h2>
        <dl>
		    <dt>DOM 1</dt>
			<dd>DOM核心（DOM Core）</dd>
			<dd>DOM HTML</dd>
            <dt>DOM 2</dt>
			<dd>DOM视图（DOM Views）</dd>
			<dd>DOM事件（DOM Events）</dd>
			<dd>DOM样式（DOM Style）</dd>
			<dd>DOM遍历和范围（DOM Traversal and Range）</dd>
            <dt>DOM 3</dt>
			<dd>DOM加载和保存（DOM Load and Save）</dd>
			<dd>DOM验证（DOM Validation）</dd>
        </dl>
    </section>
    <section>
        <h2>其他DOM标准</h2>
        <p style="text-align: left">除了DOM核心和DOM HTML之外，还有一些其他基于XML的语言发布了DOM标准。</p>
        <ol>
            <li>SVG（可伸缩矢量图形）</li>
            <li>MathML（数学标记语言）</li>
            <li>SMIL（同步多媒体继承语言）</li>
        </ol>
    </section>
    <section>
        <h2>Web 浏览器中的 DOM 支持</h2>
        <ul>
            <li class="fragment roll-in ">DOM 在被 Web 浏览器开始实现之前就已经是一种标准了。IE 首次尝试 DOM 是在 5.0 版本中，不过其实直到 5.5 版本之后才具有真正的 DOM 支持，IE 5.5 实现了 DOM Level 1。从那时起，IE 就没有引入新的 DOM 功能。</li>
            <li style="margin: 20px 0" class="fragment roll-in">Netscape 直到 Netscape 6（Mozilla 0.6.0）才引入 DOM 支持。目前，Mozilla 具有最好的 DOM 支持，实现了完整的 Level 1、几乎所有 Level 2 以及一部分 Level 3。</li>
            <li class="fragment roll-in">Opera 直到 7.0 版本才加入 DOM 支持，还有 Safari 也实现了大部分 DOM Level 1。它们几乎都与 IE 5.5 处于同一水平，有些情况下，甚至超过了 IE 5.5。不过，就对 DOM 的支持而论，所有浏览器都远远落后于 Mozilla。</li>
        </ul>
    </section>
	<section>
		<h2>BOM</h2>
		<p style="text-align: left">浏览器对象模型（<a href="http://www.w3cschool.cn/pro_js_implement.html#BOM">BOM</a>，Browser Object Model）可以控制浏览器显示的页面以外的部分。</p>
		<ol>
			<li>提供浏览器窗口相关操作的<a href="http://www.w3cschool.cn/dom_obj_window.html">Window</a>对象</li>
			<li>提供浏览器详细信息的<a href="http://www.w3cschool.cn/dom_obj_navigator.html">navigator</a>对象</li>
			<li>提供浏览器所加载页面详细信息的<a href="http://www.w3cschool.cn/dom_obj_location.html">location</a>对象</li>
			<li>提供用户显示器分辨率详细信息的<a href="http://www.w3cschool.cn/dom_obj_screen.html">screen</a>对象</li>
			<li>提供用户访问过的 URL<a href="http://www.w3cschool.cn/dom_obj_history.html">history</a>对象</li>
			<li>对cookie的支持</li>
			<li>XMLHttpRequeset和IE的ActiveXObject之类的自定义对象</li>
		</ol>
	</section>
</section>
<section>
	<section>
		<h2>5大浏览器</h2>
	</section>
	<section>
        <img src="/tech/media/web-browsers.png" />
		<p class="fragment" style="text-align: left">
            <small>
                5大浏览器都已经实现了ECMAScript第3版，对ECMAScript第5版的支持程度越来越高，但对DOM的支持彼此相差比较大。
                IE8是第一个着手实现ECMA-262第5版的浏览器，并在IE9中提供了完整的支持，Firefox4也紧随其后做到兼容。
            </small>
        </p>
        <p class="fragment" style="text-align: left">
            <small class="highlight-red">
                对已经纳入HTML5标准的BOM来说，各浏览器都实现了众所周知的共同特性，但其他特性还是会因浏览器而异。
            </small>
        </p>
		<p class="fragment" style="text-align: left">
            <small class="highlight-red">
                在DOM标准出现一段时间之后，IE5中首先尝试实现DOM，直到IE5.5才算真正支持DOM1，IE6，7中没有引入新的DOM功能，直到IE8才对以前DOM中存在的bug进行修复，IE9则开始实现DOM1级，2级和3级。Firefox3开始完全支持DOM1级，几乎完全支持DOM2级。支持DOM已经成为浏览器厂商的首要目标。
            </small>
        </p>
		<p class="fragment" style="text-align: right">
            <small class="highlight-red">
                <a href="/tech/media/timeline-of-web-browsers.svg">浏览器历史</a>
                <a target="_blank" href="https://en.wikipedia.org/wiki/History_of_the_web_browser">WIKIPEDIA</a>
            </small>
        </p>
	</section>
</section>
<section>
	<section>
	    <h2>小结</h2>
        <p style="text-align: left">JavaScript是一种专为与网页交互设计的脚本语言，有以下三部分组成：</p>
        <ol class="fragment">
            <li>ECMAScript：由ECMA-262定义，提供核心语言功能；</li>
            <li>DOM：提供访问和操作网页内容的方法和接口；</li>
            <li>BOM：提供与浏览器交互的方法和接口；</li>
        </ol>
	</section>
</section>
<section>
    <section>
        <h1>Thanks</h1>
    </section>
</section>
