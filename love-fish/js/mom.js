var momObj=function(){
	this.x;
	this.y;
	this.angle;

	this.bigTailTimer=0;
	this.bigTailCount=0;

	this.bigEyeTimer=0;
	this.bigEyeCount=0;
	this.bigEyeInterval=1000;//持续时间

	this.bigBodyCount=0;
}
momObj.prototype.init=function(){
	this.x=canWidth*0.5;
	this.y=canHeight*0.5;
	this.angle=0;
}
momObj.prototype.draw=function(){
	//趋向lerp
	this.x=lerpDistance(mx,this.x,0.98);
	this.y=lerpDistance(my,this.y,0.99);
	//计算角度差反正切
	var deltaY=my-this.y;
	var deltaX=mx-this.x;
	var beta=Math.atan2(deltaY,deltaX)+Math.PI;//-PI-到PI
	//趋向鼠标的角度
	this.angle=lerpAngle(beta,this.angle,0.6);

	this.bigTailTimer+=deltaTime;
	if(this.bigTailTimer>50){
		this.bigTailCount=(this.bigTailCount+1)%8;
		this.bigTailTimer%=50;
	}

	this.bigEyeTimer+=deltaTime;
	if(this.bigEyeTimer>this.bigEyeInterval){
		this.bigEyeCount=(this.bigEyeCount+1)%2;
		this.bigEyeTimer%=this.bigEyeInterval;
		if(this.bigEyeCount==0){
			this.bigEyeInterval=Math.random()*1500+2000;
		}else{
			this.bigEyeInterval=200;
		}
	}
	ctx1.save();
	ctx1.translate(this.x,this.y);//转换原点
	ctx1.rotate(this.angle);

	var bigTailCount=this.bigTailCount;//临时变量
	var bigEyeCount=this.bigEyeCount;
	var bigBodyCount=this.bigBodyCount;

	if(data.double==1){
		ctx1.drawImage(bigBodyOra[bigBodyCount],-bigBodyOra[bigBodyCount].width*0.5,-bigBodyOra[bigBodyCount].height*0.5);
	}else{
		ctx1.drawImage(bigBodyBlue[bigBodyCount],-bigBodyBlue[bigBodyCount].width*0.5,-bigBodyBlue[bigBodyCount].height*0.5);
	}
	ctx1.drawImage(bigTail[bigTailCount],-bigTail[bigTailCount].width*0.5+30,-bigTail[bigTailCount].height*0.5);
	ctx1.drawImage(bigEye[bigEyeCount],-bigEye[bigEyeCount].width*0.5,-bigEye[bigEyeCount].height*0.5);
	ctx1.restore();
}