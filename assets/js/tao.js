// 基本扩展方法
(function(global){
	'use strict';

	var slice = Array.prototype.slice;
	// 空方法
	var F = function(){};
	if(typeof Object.create !== 'function'){
		console.log('Object.create');
		Object.create = function(o){
			F.prototype = o;
			return new F();
		};
	}
	
	if(Function.prototype.bind === undefined){
		console.log('Function.prototype.bind');
		Function.prototype.bind = function(scope){
            if(scope === undefined){
                throw new Error('Method bind expected scope argument!');
            }   
            var that = this,
                args = slice.call(arguments, 1); 
            return function(){
                return that.apply(scope, args.concat(slice.call(arguments)));
            };  
        }; 
	}
	
	/*
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
*/

	Function.prototype.method = function(name, func){
		if(!this.prototype.hasOwnProperty(name)){
			this.prototype[name] = func;
		}
		return this;
	};

	// 为Object.prototype扩展方法，jQuery1.8.2会报错
	/*Object.method('superior', function(name){
		var that = this,
			method = that[name];
		return function(){
			method.apply(that, arguments);
		};
	});*/

	// Util
	// Namespace
	var namespace = function(name){
		var object = global,
			levels = name.split('.'),
			i, len;
		for(i=0, len=levels.length; i<len; i++){
			if(object[levels[i]] === undefined){
				object[levels[i]] = {};
			}
			object = object[levels[i]];
		}
		return object;
	};

	// Inherit
	var inherit = function(subClass, superClass){
		subClass.prototype = Object.create(superClass.prototype);
		subClass.prototype.constructor = subClass;

		subClass.superclass = superClass.prototype;

		// 修复如下A类的构造函数
		// function A(){}
		// A.prototype = {};
		// A.prototype.constructor
		if(superClass.prototype.constructor == Object.prototype.constructor){
			superClass.prototype.constructor = superClass;
		}
	};

	var klass = function(superClass, props){
		var subClass, i;
		subClass = function(){
			if(!(this instanceof subClass)){
				var that = Object.create(subClass.prototype);
				subClass.apply(that, slice.call(arguments));
				return that;
			}
			if(subClass.superclass){
				subClass.superclass.constructor.apply(this, arguments);
			}
			if(subClass.prototype.hasOwnProperty('initialize')){
				subClass.prototype.initialize.apply(this, arguments);
			}
		};
		
		if(superClass && superClass.constructor == Object){
			superClass = klass(Object, superClass);
		}

		inherit(subClass, superClass || Object);

		for(i in props){
			if(props.hasOwnProperty(i)){
				subClass.method(i, props[i]);
			}
		}

		return subClass;
	};

	// Augment
	var augment = function(receivingClass, givingClass){
		var i, len, methodName;
		// Only give certain methods
		if(arguments[2]){
			for(i=2, len=arguments.length; i<len; i++){
				methodName = arguments[i];
				receivingClass.prototype[methodName] = givingClass.prototype[methodName];
			}
		}
		else{
			for(methodName in givingClass.prototype){
				if(receivingClass.prototype[methodName] === undefined){
					receivingClass.prototype[methodName] = givingClass.prototype[methodName];
				}
			}
		}
	};

	// Contructor
	var Interface = function(name, methods){
		// 检查参数的个数，如果参数的个数不等于2个，则抛出错误
		if(arguments.length != 2){
			throw new Error('Interface constructor called with ' + arguments.length + 'arguments, but expected exactly 2.');
		}
    
		this.name = name;
		this.methods = [];
		// 循环检查方法名，如果存在错误的方法明，则抛出错误
		for(var i=0, len=methods.length; i<len; i++){
			if(typeof methods[i] !== 'string'){
				throw new Error('Interface constructor expects method names to be passed in as a string.');
			}
			this.methods.push(name);
		}
	};

	// Static class method
	Interface.ensureImplements = function(object/*, interface1, interface2... */){
		// 用enterface代替interface这个关键字
		var i, j, len, methodsLen, enterface, method;
    
		// 检查参数的个数，如果参数的个数小于2个，则抛出错误
		if(arguments.length < 2){
			throw new Error('Function Interface.ensureImplements called with ' + arguments.length + 'arguments, but expected at least 2.');
		}
    
		for(i=1, len=arguments.length; i<len; i++){
			enterface = arguments[i];
			// 检查参数的类型，如果enterface参数不是Interface的实例，则抛出错误
			if(enterface.constructor !== Interface){
				throw new Error('Function Interface.ensureImplements expects arguments two and above to be instances of Interface.');
			}
    
			for(j=0, methodsLen=enterface.methods.length; j<methodsLen; j++){
				method = enterface.methods[j];
				if(typeof object[method] !== 'function'){
					throw new Error('Function Interface.ensureImplements: object does not implement the ' + enterface.name + 'interface. Method ' + method + 'was not found.');
				}
			}
		}
	};

	// 创建tao.util命名空间，并暴露方法
	var util = namespace('tao.util');
	util.namespace = namespace;
	util.inherit = inherit;
	util.augment = augment;
	util.klass = klass;
	util.Interface = Interface;
}(this));
