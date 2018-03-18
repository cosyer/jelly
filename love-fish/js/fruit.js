var fruitObj=function(){
	this.x=[];
	this.y=[];
	this.l=[];
	this.spd=[];
	this.fruitType=[];
	this.alive=[];//状态true和false
	this.orange=new Image();
	this.blue=new Image();
}
fruitObj.prototype.num=30;
fruitObj.prototype.init=function(){
	for(var i=0;i<this.num;i++){
		this.alive[i]=false;
		this.x[i]=0;
		this.y[i]=0;
		this.spd[i]=Math.random()*0.017+0.003;
		this.born(i);
	}
	this.orange.src="./src/fruit.png";
	this.blue.src="./src/blue.png";
}
fruitObj.prototype.draw=function(){
	for(var i=0;i<this.num;i++){
		//draw find an ane grow
		if(this.alive[i]){
			if(this.fruitType[i]=="blue"){
				var pic=this.blue;
			}else{
				var pic=this.orange;
			}
		if(this.l[i]<=14){
		this.l[i]+=deltaTime*this.spd[i];
		}
		else{
			this.y[i]-=deltaTime*this.spd[i]*7;
		}
		ctx2.drawImage(pic,this.x[i]-this.l[i]*0.5,this.y[i]-this.l[i]*0.5,this.l[i],this.l[i]);}
		if(this.y[i]<10){//离开屏幕消失
			this.alive[i]=false;
		}
	}
}
fruitObj.prototype.born=function(i){
	var aneID=Math.floor(Math.random()*ane.num);
	this.x[i]=ane.headx[aneID];
	this.y[i]=ane.heady[aneID];
	this.l[i]=0;
	this.alive[i]=true;
	var ran=Math.random();
	if (ran<0.2) {
		this.fruitType[i]="blue";
	}
	else{
		this.fruitType[i]="orange";
	}
}
fruitObj.prototype.dead=function(i){
	fruit.alive[i]=false;
}
function fruitMonitor(){
	var num=0;
	for (var i=0;i<fruit.num;i++){
		if(fruit.alive[i]) num++;
	}
	if(num<15){
		//send up
		sendFruit();
		return;
	}
}
function sendFruit(){
	for(var i=0;i<fruit.num;i++){
		if(!fruit.alive[i]){
			fruit.born(i);
			return;
		}
	}
}