(function(global){
	'usr strict';

	var util = global.tao.util;
	var geometry = util.namespace('qling.geometry');
	// 矢量

	var Vector = util.klass(null, {
		initialize: function(x, y){
			this.x = x;
			this.y = y;
		},
		moveTo: function(x, y){
			this.x = x;
			this.y = y;
		},
		add: function(vector) {
			this.x += vector.x;
			this.y += vector.y;
		},
		sub: function(vector) {
			this.x -= vector.x;
			this.y -= vector.y;
		},
		negate: function() {
			this.x = -vector.x;
			this.y = -vector.y;
		},
		scale: function(scale) {
			this.x *= scale;
			this.y *= scale;
		},
		rotate: function(angle) {
			var x = this.x, 
				y = this.y,
				cosVal = Math.cos(angle),
				sinVal = Math.sin(angle);
    
			this.x = x * cosVal - y * sinVal;
			this.y = x * sinVal + y * cosVal;
		},
		lengthSquared: function() {
			return Math.pow(this.x, 2) + Math.pow(this.y, 2);
		},
		length: function() {
			return Math.sqrt(this.lengthSquared());
		},
		normalize: function() {
			var length = this.length();
			if (length) {
				this.x /= length;
				this.y /= length;
			}
			return length;
		},
		toString: function() {
			return '(' + this.x.toFixed(3) + ',' + this.y.toFixed(3) + ')';
		}
	});

	var Circle = util.klass(Vector, {
		initialize: function(x, y, radius, context, value){
			this.radius = radius;
			this.context = context;
			this.value = value;
		},
		draw: function(){
			var x = this.x,
				y = this.y,
				radius = this.radius,
				context = this.context,
				value = this.value,
				startAngle = Circle.START_ANGLE,
				endAngle = Circle.END_ANGLE;
    
			context.beginPath();
			context.arc(x, y, radius, startAngle, endAngle, true);
			context.closePath();
			context.stroke();
			context.fillText(value, x, y);
		}
	});

	Circle.START_ANGLE = 0;
	Circle.END_ANGLE = Math.PI * 2;

	geometry.Vector = Vector;
	geometry.Circle = Circle;
}(this, this.jQuery));

(function(global, $){
	'usr strict';
	var util = global.tao.util,
		meditation = util.namespace('qling.meditation');

	var Table = util.klass(null, {
		initialize: function(selector, template){
			this.$body = $(selector);
			this.template = _.template(template);
		},
		render: function(nodes){
			var html = this.template({nodes:nodes});
			this.$body.append(html);
		}
	});

	meditation.Table = Table;
}(this, this.jQuery));

(function(global, $){
	var Circle = qling.geometry.Circle;
	$.board = function(selector, options) {
		options = $.extend({}, options);
		var num = options.num, i,
			tree = [],
			circles = [],
			$target = $(selector),
			width = $target.width(),
			height = $target.height(),
			ctx = $target[0].getContext('2d'),
			space = width / (num + 1),
			radius = 9;

		$target.attr({
			width: width,
			height: height
		});

		ctx.font = 'bold 12px sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		for (i = 0; i < num; i++) {
			circles.push(new Circle(space*(1+i), radius*2, radius, ctx, i));
			tree.push({value: i, subNodes:[]});
		}

		var update = function(nodes){
			var i, len, node, parent, child, children=[];
			for(i=0, len=nodes.length; i<len; i++){
				node = nodes[i];
				if(node.parent){
					parent = node.value;
				}
				else if(node.child){
					children.push(i);
				}
			}
			for(i=0, len=tree.length; i<len; i++){
				node = tree[i];
				if(node.value === parent){
					parent = i;
				}
				else if(~children.indexOf(node.value)){
					child = i;
				}
			}
			
			node = tree[child];
			node.subNodes.push(node.value);
			children = tree[parent].subNodes.concat(node.subNodes).sort();
			tree[parent].subNodes = children;
			tree.splice(child, 1);
		};

		var move = function(){
			var i, iLen,
				j, jLen,
				space, sLen = 0,
				subNodes,
				circle,
				x,
				ox, oy,
				bound = {min:0, max:0};
			for(i=0, iLen=tree.length; i<iLen; i++){
				if(tree[i].subNodes.length > 0){
					sLen++;
				}
			}
			x = space = width / (num - sLen + 1);
			ctx.beginPath();
			for(i=0, iLen=tree.length; i<iLen; i++){
				subNodes = tree[i].subNodes;
				jLen = subNodes.length;
				if(jLen === 0){
					circle = circles[tree[i].value];
					circle.x = x;
					circle.y = radius * 2;
					x += space;
				}
				else{
					circle = circles[tree[i].value];
					circle.x = x + space * (jLen - 1) / 2;
					circle.y = radius * 2;
					ox = circle.x;
					oy = circle.y + radius;
					for(j=0; j<jLen; j++){
						circle = circles[subNodes[j]];
						circle.x = x;
						circle.y = radius * 6;
						ctx.moveTo(ox, oy);
						ctx.lineTo(circle.x, circle.y - radius);
						x += space;
					}
				}
			}
			ctx.closePath();
			ctx.stroke();
		};

		var draw = function(){
			ctx.clearRect(0, 0, width, height);
			for (i = 0; i < num; i++) {
				circles[i].draw();
			}
		};

		var refresh = function(nodes){
			update(nodes);
			move();
			draw();
		};

		draw();

		return {
			refresh: refresh 
		};
	};
}(this, this.jQuery));
