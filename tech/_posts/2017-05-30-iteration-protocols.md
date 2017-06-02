---
layout: post
title: 迭代协议
tags: 原创 技术
---

> 从第一次阅读阮一峰老师书上读到ES6的Generator语法，和后来Koa中的CO，一直以来都是模模糊糊没有深度的学习，直到尹洁的[js 异步代码同步化处理之 generator](https://yj1438.github.io/2017/03/02/generator.html)有了更深层次的理解，但这几天看小问的《实战ES2015》中的生成器部分还是不够如意——不能完全融入到自己的脑子和思维中从零演绎整个过程——尤其不能演绎常用的Ajax使用场景。槛总要迈过去才好，便从ES6迭代协议的角度将其重新梳理学习以将其理解透彻。  
> TooBug同学[学习ES6生成器（Generator）](https://www.toobug.net/article/learning_es6_generator.html)博文中提到的用Promise将回调函数封装为统一形式的观点是思维开始澄清的一个关键转折点，特别感谢。

## 核心概念

> 协议就是一组特定的键值对的集合，一个对象包含了该属性集合也就实现了该协议，一个协议可以被多个对象实现，一个对象也可以实现多个协议。跟迭代相关的主要协议和相关概念如下：

1. 可迭代协议（[The Iterable Interface](http://www.ecma-international.org/ecma-262/6.0/#sec-iterable-interface)）
    > 可迭代协议允许JavaScript对象去定义或定制它们的迭代行为，为了变成可遍历对象，一个对象必须实现`@@iterator`方法, 即这个对象（或者它原型链上的某个对象）必须有一个名字是`Symbol.iterator`的属性:  
    >
    > | 属性 | 必选 | 值 |
    > |-----|------|-----|
    > | [Symbol.iterator] | 是 | 返回一个迭代器对象的无参函数。当一个对象需要被遍历的时候（比如用于一个for..of循环中），该方法被调用并返回一个用于在遍历中获得值的迭代器。 |

2. 迭代器协议（[The Iterator Interface](http://www.ecma-international.org/ecma-262/6.0/#sec-iterator-interface)）
    > 该迭代器协议定义了一种标准的方式来产生一个有限或无限序列的值。当一个对象被认为是一个迭代器时，它实现了一个 next() 的方法并且拥有以下含义：
    >
    > | 属性 | 必选 | 值 |
    > |------|-----|----|
    > | next | 是 | 返回一个迭代器返回值对象的函数，也可以通过接受一个参数用以向生成器传值，如果之前的返回值的`done`属性为`true`，则返回值`done`属性为`true` |
    > | return | 否 | 返回一个迭代器返回值对象并结束当前迭代器的函数，其`done`属性为`true`。如果包含调用参数，则返回值`value`属性为该参数值 |
    > | throw | 否 | 返回一个迭代器返回值对象并向生成器抛出异常的函数向迭代器中抛出一个错误，其返回值为下一个迭代器返回值 |

3. 迭代器返回值协议（[The IteratorResult Interface](http://www.ecma-international.org/ecma-262/6.0/#sec-iteratorresult-interface)）
    > 迭代器返回值需要遵循的协议，含义如下：  
    >
    > | 属性 | 必选 | 值 |
    > |------|-----|----|
    > | done | 否 | 当迭代器遍历到迭代序列末端时返回值 true。此时，迭代器可以将返回值作为 value。当迭代器仍可继续在迭代序列中向前遍历时返回值 false。这相当于不指定 done 属性。 |
    > | value | 否 | 迭代器返回的任意的Javascript值。当 done 的值为 true 时可以忽略该值。 |

4. 可迭代对象
    > 一个迭代器对象 ，知道如何每次访问集合中的一项， 并记录它的当前在序列中所在的位置。 在  JavaScript 中 迭代器是一个对象，它提供了一个 next() 方法，返回序列中的下一项。这个方法返回包含done和value两个属性的对象。可以自定义可迭代对象，也可以使用generator函数。
    >
    > 包含可迭代对象的内置类型包含`String`，`Array`，`TypedArray`，`Map`，`Set`，它们的原型对象都有一个`@@iterator`方法；
    > 一些内置的语法结构，比如 spread operator，内部也使用了同样的迭代协议；
    > 另外可以通过`@@iterator`方法重新定义迭代行为。  
    > 获取可迭代对象原型对象的方法如下。  
    > ```javascript
    > Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()))
    > ```

5. for-of循环
    > for-of循环语句通过迭代器方法调用来获取要遍历的各种集合，`for...of`语法是为各种collection对象专门定制的，并不适用于所有的object。它会以这种方式迭代出任何拥有[Symbol.iterator] 属性的collection对象的每个元素。

6. GeneratorFunction
    > function* 声明 (function关键字后跟一个星号）定义了一个生成器函数 (generator function)，它返回一个  Generator  对象。调用一个生成器函数并不马上执行它的主体，而是返回一个这个生成器函数的迭代器（iterator）对象。当这个迭代器的next()方法被调用时，生成器函数的主体会被执行直至第一个yield表达式，该表达式定义了迭代器返回的值，或者，被 yield*委派至另一个生成器函数。next()方法返回一个对象，该对象有一个value属性，表示产出的值，和一个done属性，表示生成器是否已经产出了它最后的值。

7. Generator
    > 生成器对象是由一个 generator function 返回的,并且它符合可迭代协议和迭代器协议。
    > <p data-height="265" data-theme-id="0" data-slug-hash="KmLavy" data-default-tab="js,result" data-user="testudy" data-embed-version="2" data-pen-title="Generator" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/testudy/pen/KmLavy/">Generator</a> by testudy (<a href="https://codepen.io/testudy">@testudy</a>) on <a href="https://codepen.io">CodePen</a>.</p>

## 演绎过程

总的演绎和改进推导过程如下，可以在console中查看执行结果。下面将关键代码和思考细节记录如下：

<p data-height="265" data-theme-id="0" data-slug-hash="XRwBYx" data-default-tab="result" data-user="testudy" data-embed-version="2" data-pen-title="Generator Async" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/testudy/pen/XRwBYx/">Generator Async</a> by testudy (<a href="https://codepen.io/testudy">@testudy</a>) on <a href="https://codepen.io">CodePen</a>.</p>

### Step 1. 简单回调函数版本

```javascript
function echo(param, callback) {
    console.log("before:", param);
    const result = param;
    callback(null, result);
    console.log("after:", param);
}

function main() {
    echo("hello", (error, result) => {
        console.log(1, result);
        echo(`${result} world`, (error, result) => {
            console.log(2, result);
        });
    });
}
main();
```

执行结果如下，完全符合预期
```
before: hello
1 "hello"
before: hello world
2 "hello world"
after: hello world
after: hello
```

### Step 2. Generator初步版本

```javascript
function echo(param) {
    console.log("before:", param);
    const result = param;
    console.log("after:", param);
    return result;
}

function* main() {
    let result;
    result = yield echo("hello");
    console.log(1, result);
    result = yield echo(`${result} world`);
    console.log(2, result);
}

function run(generatorFunction) {
    const generator = generatorFunction();
    let currentResult;

    do {
        currentResult = generator.next(currentResult && currentResult.value);
    } while (!currentResult.done);
}

run(main);
```

执行结果如下，由于该版本代码是同步版本，main函数中先调用echo，再输出执行结果，所以执行结果顺序和Step 1中顺序出现差异。  
`run`函数控制`main`的执行，并通过`next`方法的参数将上一次的执行结果回传给`main`。
```
before: hello
after: hello
1 "hello"
before: hello world
after: hello world
2 "hello world"
```

### Step 3. Generator同步回调版本

```javascript
function echo(param) {
    console.log("before:", param);
    const result = param;
    return callback => {
        callback(null, result);
        console.log("after:", param);
    };
}

function* main() {
    let result;
    result = yield echo("hello");
    console.log(1, result);
    result = yield echo(`${result} world`);
    console.log(2, result);
}

function run(generatorFunction) {
    const generator = generatorFunction();
    let currentResult;
    let currentValue;

    do {
        currentResult = generator.next(currentValue);
        if (currentResult.done) {
            break;
        }
        currentResult.value((error, value) => {
            currentValue = value;
        });
    } while (!currentResult.done);
}
```

执行结果如下，和Step 2版本相同。
```
before: hello
after: hello
1 "hello"
before: hello world
after: hello world
2 "hello world"
```

这个版本中，将`echo`函数的返回值用回调函数封装，以让run函数中获得echo函数的一部分流程控制权。这个版本中，本质上echo的调用和流程控制依然是同步的，先将main函数中的流程推进到yield处的echo调用，随后调用回掉函数赋值，再下一个循环中将返回值传入main函数。所以版本2、3的执行结果相同。

### Step 4. Generator异步回调版本

```javascript
function echo(param) {
    console.log("before:", param);
    const result = param;
    return callback => {
        callback(null, result);
        console.log("after:", param);
    };
}

function* main() {
    let result;
    result = yield echo("hello");
    console.log(1, result);
    result = yield echo(`${result} world`);
    console.log(2, result);
}

function run(generatorFunction) {
    const generator = generatorFunction();

    function next(prevValue) {
        const currentResult = generator.next(prevValue);
        if (currentResult.done) {
            return;
        }
        currentResult.value((error, value) => {
            next(value);
        });
    }

    next();
}

run(main);
```

执行结果如下，版本4和版本3的关键差异是再回调函数内部执行next，即形成了回掉的嵌套（这种方式存在很大的问题，比如有可能爆掉调用栈），成了类似异步的执行效果，结果和版本1相同。
```
before: hello
1 "hello"
before: hello world
2 "hello world"
after: hello world
after: hello
```

### Step 5. 普通延时版本

```javascript
function echo(param, callback) {
    console.log("before:", param);
    const result = param;
    setTimeout(function() {
        callback(null, result);
        console.log("after:", param);
    }, 500);
}

function main() {
    echo("hello", (error, result) => {
        console.log(1, result);
        echo(`${result} world`, (error, result) => {
            console.log(2, result);
        });
    });
}

main();
```

执行结果如下，符合预期。
```
before: hello
1 "hello"
before: hello world
after: hello
2 "hello world"
after: hello world
```

### Step 6. Generator延时版本

```javascript
function echo(param) {
    console.log("before:", param);
    const result = param;
    return callback => {
        setTimeout(function() {
            callback(null, result);
            console.log("after:", param);
        }, 500);
    };
}

function* main() {
    let result;
    result = yield echo("hello");
    console.log(1, result);
    result = yield echo(`${result} world`);
    console.log(2, result);
}

function run(generatorFunction) {
    const generator = generatorFunction();

    function next(prevValue) {
        const currentResult = generator.next(prevValue);
        if (currentResult.done) {
            return;
        }
        currentResult.value((error, value) => {
            next(value);
        });
    }

    next();
}

run(main);
```

执行结果如下，和版本5相同。
```
before: hello
1 "hello"
before: hello world
after: hello
2 "hello world"
after: hello world
```

### Step 7. Generator Ajax版本

```javascript
function ajax(url) {
    console.log("before:", url);
    return (callback) => {
        const xhr = new XMLHttpRequest();
  
        xhr.open("GET", url);
  
        xhr.onload = function() {
            callback(null, this.status);
            console.log("after:", url);
        };
  
        xhr.onerror = function(event) {
            callback(new Error("load error"), this.status);
            console.log("after:", url);
        };
  
        xhr.send();
    };
}

function* main() {
    let result;
    result = yield ajax(location.href);
    console.log(1, result);
    result = yield ajax(
        `//${location.host}/${String(Math.random()).substr(2)}.html`
    );
    console.log(2, result);
}

function run(generatorFunction) {
    const generator = generatorFunction();

    function next(prevValue) {
        const currentResult = generator.next(prevValue);
        if (currentResult.done) {
            return;
        }
        currentResult.value((error, value) => {
            next(value);
        });
    }

    next();
}

run(main);
```

执行结果如下，和timeout执行顺序相似。只需要将Ajax封装到callback中即可（这是一直纠结的问题，脑子陷入了死胡同，没有想明白可以callback一切的，callback是返回函数执行完毕的回调）。
```
before: ${url1}
1 200
before: ${url2}
after: ${url1}
2 0
after: ${url2}
```

### Step 8. Generator Promise版本

```javascript
function delay(time) {
    console.log("before:", time);
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
            console.log("after:", time);
        }, time);
    });
}
function ajax(url) {
    console.log("before:", url);
    return new Promise(function(resolve, reject) {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", url);

        xhr.onload = function() {
            resolve(this.status);
            console.log("after:", url);
        };

        xhr.onerror = function(event) {
            reject(new Error("load error"));
            console.log("after:", url);
        };

        xhr.send();
    });
}

function* main() {
    let result;
    result = yield delay(500);
    console.log(1, result);
    result = yield ajax(location.href);
    console.log(2, result);
    try {
        result = yield ajax(
            `//${location.host}/${String(Math.random()).substr(2)}.html`
        );
        console.log(3, result);
    } catch (ex) {
        console.log(ex);
    }
}

function run(generatorFunction) {
    const generator = generatorFunction();

    function next(prevValue) {
        const currentResult = generator.next(prevValue);
        if (currentResult.done) {
            return;
        }
        currentResult.value
            .then(value => {
                next(value);
            })
            .catch(error => {
                generator.throw(error);
            });
    }

    next();
}

run(main);
```

执行结果如下，用Promise代替callback的封装，原因主要：一是Promise对各种类型对象的封装更统一；二是解决callback回调不安全的问题（版本4）。
```
before: 500
after: 500
1 undefined
before: ${url1}
after: ${url1}
2 200
before: ${url2}
after: ${url2}
Error: load error
```

## 结论
用`async/await`实现异步操作是目前最优雅的形式，尹洁同学的[js 异步代码同步化处理之 await/async](https://yj1438.github.io/2017/02/23/promise_2.html)中有示例介绍和`Promise`、`async/await`、`Generator`三种实现形式的对比。本文中所提到的generator形式只是过去的一种解决方案，这篇博文的目的一是澄清自己的思维，二是学习这种思维——过时的可能是方案，但思维的闪光点永远存在。

## 参考资料
1. [ecma-262/6.0/#sec-control-abstraction-objects](http://www.ecma-international.org/ecma-262/6.0/#sec-control-abstraction-objects)
2. [js 异步代码同步化处理之 generator](https://yj1438.github.io/2017/03/02/generator.html)
3. [深入浅出ES6（二）：迭代器和for-of循环](http://www.infoq.com/cn/articles/es6-in-depth-iterators-and-the-for-of-loop)
4. [深入浅出ES6（三）：生成器 Generators](http://www.infoq.com/cn/articles/es6-in-depth-generators)
5. [深入浅出ES6（十一）：生成器 Generators，续篇](http://www.infoq.com/cn/articles/es6-in-depth-generators-continued)
6. [迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)
7. [迭代器和生成器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators)
8. [for...of](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)
9. [function\*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)
10. [Generator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)
11. [Generator.prototype.next()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator/next)
12. [Generator.prototype.return()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator/return)
13. [Generator.prototype.throw()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator/throw)
14. [[Javascript] ES6 Generator基礎](http://huli.logdown.com/posts/292331-javascript-es6-generator-foundation)
15. [[Javascript] Promise, generator, async與ES6](http://huli.logdown.com/posts/292655-javascript-promise-generator-async-es6)
16. [Harmony Generator, yield, ES6, co框架学习](http://bg.biedalian.com/2013/12/21/harmony-generator.html)
17. [学习ES6生成器（Generator）](https://www.toobug.net/article/learning_es6_generator.html)
18. [Experiments with Koa and JavaScript Generators](http://blog.stevensanderson.com/2013/12/21/experiments-with-koa-and-javascript-generators/)
19. [拥抱Generator，告别异步回调](https://cnodejs.org/topic/542953d42ca9451e1bf3c251)
20. [ES6 中的生成器函数介绍](https://imququ.com/post/generator-function-in-es6.html)
21. [ES6 generator函数与co一瞥](http://jimliu.net/2014/11/28/a-brief-look-at-es6-generator-function/)
22. [ES6 generator函数与co再一瞥](http://jimliu.net/2015/01/18/more-about-es6-generator-function/)
23. [继续探索JS中的Iterator，兼谈与Observable的对比](http://jimliu.net/2017/03/31/adventure-of-js-iterators-and-compare-to-observables/)

<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
