/**
 * @author Administrator
 */
//子弹类
function Bullet(){
	//子弹对象，速度，威力，方向，起点坐标，定时器
	this.bullet = null;
	this.speed = 30;
	this.outside = false;
	this.power = 1;
	this.direction = null;
	this.startPos = {x:0,y:0};
	this.timer = null;
	this.domClass = "";
}
//子弹销毁
Bullet.prototype.die = function(){
	var _this = this;
	document.getElementById("container").removeChild(_this.bullet);
	_this.outside = true;	
};
//子弹发射
Bullet.prototype.fire = function(){
	var _this = this;
	//创建子弹
	_this.bullet = document.createElement("i");
	_this.bullet.className = _this.domClass;
	document.getElementById("container").appendChild(_this.bullet);
	_this.bullet.style.left = _this.startPos.x + "px";
	_this.bullet.style.top = _this.startPos.y + "px";
	_this.bullet.style.top = _this.bullet.offsetTop - _this.speed + "px";		
};
