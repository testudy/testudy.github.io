<!DOCTYPE html>
<html>
<head>
    <title>Less</title>
    <meta charset="utf-8" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico"/>
    <script src="/lib/reveal/2.6.1/lib/js/head.min.js"></script>
    <link rel="stylesheet" href="/lib/reveal/2.6.1/css/reveal.css">
    <link rel="stylesheet" href="/lib/reveal/2.6.1/css/theme/default.css" id="theme">
    <!-- For syntax highlighting -->
    <link rel="stylesheet" href="/lib/reveal/2.6.1/lib/css/zenburn.css">
    <!-- If the query includes 'print-pdf', use the PDF print sheet -->
    <script>
        (function () {
            var name = location.search.match(/print-pdf/gi) ? 'pdf' : 'paper';
            document.write('<link rel="stylesheet" href="/lib/reveal/2.6.1/css/print/' + name + '.css" media="print">' );
        }());
    </script>
</head>
<body>











<div class="reveal">
    <div class="slides">
        <section>
            <section>
                <h1><img style="border: none; background: none;box-shadow:none; width: 250px" src="/img/logo.png"></h1>
                <p>By 冦云</p>
            </section>
        </section>
        <section>
            <section>
               <h2>什么是LESS</h2>
            </section>
            <section>
                <h2>Overview</h2>
                <ul>
                    <li style="padding: .5em 0" class="fragment">一种动态样式语言，属于CSS预处理语言的一种</li>
                    <li style="padding: .5em 0" class="fragment">使用类似CSS的语法，为CSS的赋予了动态语言的特性,如变量、继承、运算、函数等</li>
                    <li style="padding: .5em 0" class="fragment">更方便CSS的编写和维护</li>
                </ul>
            </section>
        </section>
        <section>
            <section>
                <h2>怎么用</h2>
            </section>
            <section>
                <h2>gui编译工具</h2>
                <p style="text-align: left"><small>为方便起见，建议初学者使用GUI编译工具来编译.less文件，以下是一些可选GUI编译工具：</small></p>
                <ol style="word-break: break-all">
                    <li class="fragment" style="padding: .5em 0" >koala(Win/Mac/Linux)<br>国人开发的LESSCSS/SASS编译工具。下载地址：http://koala-app.com/index-zh.html</li>
                    <li class="fragment" style="padding: .5em 0">Codekit(Mac)<br>一款自动编译Less/Sass/Stylus/CoffeeScript/Jade/Haml的工具，含语法检查、图片优化、自动刷新等附加功能。下载地址http://incident57.com/codekit/</li>
                    <li class="fragment" style="padding: .5em 0">WinLess(Win)<br>一款LESS编译软件。下载地址http://winless.org/</li>
                </ol>
            </section>
            <section>
                <h2>node 编译</h2>
                <pre><code>
$ npm install -g less
$ lessc styles.less
$ lessc styles.less > styles.css -x
                </code></pre>
            </section>
            <section>
                <h2>客户端使用</h2>
                <pre><code>
&lt; link rel="stylesheet/less" type="text/css" href="styles.less" / >
&lt; script src="less.js" type="text/javascript">&lt;/script>
                </code></pre>
            </section>
            <section>
                <h2>chrome 中调试</h2>
                <p><small><a href="http://code.tutsplus.com/tutorials/working-with-less-and-the-chrome-devtools--net-36636">http://code.tutsplus.com/tutorials/working-with-less-and-the-chrome-devtools--net-36636</a></small></p>
            </section>
            <section>
                <h2>在编辑器中使用</h2>
            </section>
        </section>
        <section>
            <section>
                <h2>语言特性</h2>
            </section>
            <section>
                <h2>变量Variables</h2>
                 <pre><code class="css">
@nice-blue: #5B83AD;
@light-blue: @nice-blue + #111;

#header {
color: @light-blue;
}
                 </code></pre>
                 <pre><code class="css">
#header {
color: #6c94be;
}
                 </code></pre>
            </section>
            <section>
                <h2>混合Mixins</h2>
                 <pre><code class="css">
 .bordered {
 border-top: dotted 1px black;
 border-bottom: solid 2px black;
 }
 #menu a {
 color: #111;
 .bordered;
 }

 .post a {
 color: red;
 .bordered;
 }
                 </code></pre>
                 <pre><code class="css">
 #menu a {
 color: #111;
 border-top: dotted 1px black;
 border-bottom: solid 2px black;
 }
 .post a {
 color: red;
 border-top: dotted 1px black;
 border-bottom: solid 2px black;
 }
                 </code></pre>
            </section>
            <section>
                <h2>嵌套规则Nested rules</h2>
                 <pre><code class="css">
 #header {color: black;
      .navigation {font-size: 12px;}
      .logo {width: 300px; }
      &:after {content: "\20";visibility: hidden;}
  }
                 </code></pre>
                 <pre><code class="css">
  #header {color: black; }
  #header .navigation { font-size: 12px;  }
  #header .logo { width: 300px;}
  #header:after {  content: "\20";  visibility: hidden; }
                 </code></pre>
            </section>
            <section>
                <h2>运算Operations</h2>
                 <pre><code class="css">
  @base: 5%;
  @filler: @base * 2;
  @other: @base + @filler;
  @var: 1px + 5;

  .nav{color: #888 / 4; background-color: @base + #111;
       height: 100% / 2 + @filler; width: @var;
      }
                 </code></pre>
                 <pre><code class="css">
  .nav { color: #222222;  background-color: #ff5726;
         height: #ffbe5c;width: #ff0000;
   }
                 </code></pre>
            </section>
            <section>
                <h2>函数Functions</h2>
                 <pre><code class="css">
 @base: #f04615;
 @width: 0.5;

 .class {
   width: percentage(@width); // returns `50%`
   color: saturate(@base, 5%);
   background-color: spin(lighten(@base, 25%), 8);
 }
                 </code></pre>

            </section>
            <section>
                <h2>命名空间和构造函数</h2>
                 <pre><code class="css">
   #bundle {
   .button {display: block; border: 1px solid black;
            background-color: grey;
            &:hover { background-color: white}
           }
         }
   #header a { color: orange;
   #bundle > .button;
   }
                 </code></pre>

             <pre><code class="css">
  #header a {color: orange; display:
             block;border: 1px solid
             black;background-color: grey;
  }
  #header a:hover {background-color: #ffffff;}
             </code></pre>

            </section>

            <section>
                <h2>作用域</h2>
                 <pre><code class="css">
 @var: red;

 #page {
 #header {
   color: @var; // white
   }
   @var: white;
 }
                 </code></pre>

             <pre><code class="css">
  #page #header {
    color: #ffffff;
  }
             </code></pre>

            </section>
            <section>
                <h2>注释Comments</h2>
                 <pre><code class="css">
 /* One hell of a block
 style comment! */

 // Get in line! （这样段不会被转译）
                 </code></pre>

            </section>
            <section>
                <h2>引用Importing</h2>
                 <pre><code class="css">
@import "library"; less文件不用加后缀名
@import "typo.css";
                 </code></pre>

            </section>
        </section>

        <section>
            <section>
                <h1>Thanks</h1>
            </section>
        </section>
    </div>
</div>

<!-- footer -->
<script src="/lib/reveal/2.6.1/js/reveal.min.js"></script>
<script>
    Reveal.initialize({
        controls: true,
        progress: true,
        history: true,
        center: true,
        theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
        transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/none
        // Optional libraries used to extend on reveal.js
        dependencies: [
            { src: '/lib/reveal/2.6.1/lib/js/classList.js', condition: function() { return !document.body.classList; } },
            { src: '/lib/reveal/2.6.1/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
        ]
    });

</script>
</body>
</html>
