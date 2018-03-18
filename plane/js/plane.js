/**
 * @author liege
 * date:2014-6-10 18:10:42
 */
//飞机类
function Plane(){
	this.plane = null;
	this.life = true;
	this.armor = 1;
	this.position = {x:0,y:0};
	this.class = null; 
	this.direction = "up";
	this.bullets = null;
	this.lv = 1;
}
//显示飞机
Plane.prototype.show = function(){
	this.plane = document.createElement("p");
	this.plane.score = 0;
	this.plane.className = this.class;
	document.getElementById("container").appendChild(this.plane);
};
//飞机爆炸
Plane.prototype.bang = function(){
	var _this = this;
	var x = _this.plane.offsetLeft,
		y = _this.plane.offsetTop,
		w = _this.plane.offsetWidth,
		h = _this.plane.offsetHeight,
		NO = _this.class.slice(3),
		timer = null,
		bangObj = null;	
				
	_this.die();
	//创建爆炸动画
	bangObj = document.createElement("span");
	bangObj.style.left = x+"px";
	bangObj.style.top = y+"px";
	bangObj.style.width = w+"px";
	bangObj.style.height = h+"px";
	bangObj.className = "bang"+NO;	
	document.getElementById("container").appendChild(bangObj);	
	//0.2秒后移除爆炸动画
	window.setTimeout(timer);
	timer = window.setTimeout(function(){
		document.getElementById("container").removeChild(bangObj);
	},300);			
};
//飞机销毁
Plane.prototype.die = function(){
	var _this = this;
	if(_this.plane){
	document.getElementById("container").removeChild(_this.plane);
	}
	_this.outside = true;		
};
//我机
function myPlane(){}
myPlane.prototype = new Plane();
//飞机开火
myPlane.prototype.fire = function(){
	var _this = this;
	if(_this.lv == 1){
		_this.position = {
			x:_this.plane.offsetLeft + _this.plane.offsetWidth/2 - 2,
			y:_this.plane.offsetTop + 40
		};
	}
	if(_this.lv == 2){
		_this.position = {
			x:_this.plane.offsetLeft + _this.plane.offsetWidth/2 - 16,
			y:_this.plane.offsetTop + 20
		};
	}	
	if(_this.lv == 3){
		_this.position = {
			x:_this.plane.offsetLeft + _this.plane.offsetWidth/2 - 33,
			y:_this.plane.offsetTop
		};
	}	
	//实例化子弹
	var b = new Bullet();
	_this.bullets = b;
	_this.bullets.power = _this.lv;
	_this.bullets.domClass = "lv" + _this.lv;
	//子弹方向等于飞机方向
	_this.bullets.direction = _this.direction; 
	//子弹初始坐标等于飞机position值
	_this.bullets.startPos = _this.position;		
	//子弹飞行
	_this.bullets.fire();	
};
//飞机跟随鼠标移动
myPlane.prototype.move = function(state){
	var _this = this;
	_this.stage = document.getElementById("container");
	 //飞机跟随鼠标移动
	_this.stage.onmouseover = function(e){
		_this.stage.onmousemove = function(e){
			var E = e||event;
			_this.position.x = E.clientX- _this.stage.offsetLeft - _this.plane.offsetWidth/2;
			_this.position.y = E.clientY- _this.stage.offsetTop - _this.plane.offsetHeight/2;
			_this.plane.style.left = _this.position.x + "px";
			_this.plane.style.top = _this.position.y + "px";		
			if(_this.plane.offsetLeft>_this.stage.offsetWidth-_this.plane.offsetWidth){
				_this.plane.style.left = _this.stage.offsetWidth-_this.plane.offsetWidth + "px";
			}
			if(_this.plane.offsetLeft<0){
				_this.plane.style.left = 0;
			}
			if(_this.plane.offsetTop<0){
				_this.plane.style.top = 0;
			}
			if(_this.plane.offsetTop>_this.stage.offsetHeight-_this.plane.offsetHeight){
				_this.plane.style.top = _this.stage.offsetHeight-_this.plane.offsetHeight + "px";
			}
		};
		_this.stage.onmouseout = function(){
			_this.stage.onmousemove = null;
		};
	};

};
//飞机停止跟随鼠标
myPlane.prototype.stop = function(){
	this.stage.onmouseover = null;
	this.stage.onmousemove = null;
};
//敌机
function npcPlane(){}
npcPlane.prototype = new Plane();
npcPlane.prototype.direction = "down";
npcPlane.prototype.outside = false;
npcPlane.prototype.appear = function(){
	var _this = this;
	//随机横坐标出现
	_this.position.x = Math.random()*(document.getElementById("container").offsetWidth-_this.plane.offsetWidth);
	_this.plane.style.left = _this.position.x + "px";		
	_this.plane.style.top = -_this.plane.offsetHeight + "px";	
};


