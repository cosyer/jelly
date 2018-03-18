var aneObj=function(){
	//x轴坐标和高度，对象就是函数，进行原型添加
	//二次贝塞尔曲线+正弦函数
	//开始点、控制点、结束点
	this.rootx=[];
	this.headx=[];
	this.heady=[];
	this.alpha=0;
	this.amp=[];
}
aneObj.prototype.num=50;

aneObj.prototype.init=function(){
	for(var i=0;i<this.num;i++){
		this.rootx[i]=i*16+Math.random()*20;
		this.headx[i]=this.rootx[i];
		this.heady[i]=canHeight-250+Math.random()*50;
		this.amp[i]=Math.random()*50+50;
	}
}

aneObj.prototype.draw=function(){
	this.alpha+=deltaTime*0.0008;
	var l=Math.sin(this.alpha);
	ctx2.save();
	ctx2.globalAlpha=0.6;
	ctx2.lineWidth=20;
	ctx2.lineCap="round";
	ctx2.strokeStyle="#3b154e";
	for(var i=0;i<this.num;i++){
		//draw ane
		ctx2.beginPath();
		ctx2.moveTo(this.rootx[i],canHeight);
		ctx2.quadraticCurveTo(this.rootx[i],canHeight-100,this.headx[i]+l*this.amp[i],this.heady[i]);
		ctx2.stroke();
	}
	ctx2.restore();
}