var can1;
var can2;

var ctx1;
var ctx2;

var lastTime;
var deltaTime;
var bgPic=new Image();
var canWidth;
var canHeight;

var ane;
var fruit;
var mom;
var mx;
var my;
var baby;
var data;
var wave;
var halo;
var babyTail=[];
var babyEye=[];
var babyBody=[];
var bigTail=[];
var bigEye=[];
var bigBodyOra=[];
var bigBodyBlue=[];
document.body.onload=game;

function game(){
	init();
	lastTime=Date.now();
	deltaTime=0;
	gameloop();
}

function init(){
	//获得canvas context来绘制背景
	can1=document.getElementById("canvas1");
	ctx1=can1.getContext('2d');
	can2=document.getElementById("canvas2");
	ctx2=can2.getContext('2d');
	bgPic.src="./src/background.jpg";
	canWidth=can1.width;
	canHeight=can1.height;
	can1.addEventListener('mousemove',onMouseMove,false);

	mx=canWidth*0.5;
	my=canHeight*0.5;
	for(var i=0;i<8;i++){
		babyTail[i]=new Image();
		babyTail[i].src="./src/babyTail"+i+".png";
	}
	for(var i=0;i<2;i++){
		babyEye[i]=new Image();
		babyEye[i].src="./src/babyEye"+i+".png";
	}
	for(var i=0;i<20;i++){
		babyBody[i]=new Image();
		babyBody[i].src="./src/babyFade"+i+".png";
	}

	for(var i=0;i<8;i++){
		bigTail[i]=new Image();
		bigTail[i].src="./src/bigTail"+i+".png";
	}
	for(var i=0;i<2;i++){
		bigEye[i]=new Image();
		bigEye[i].src="./src/bigEye"+i+".png";
	}
	for(var i=0;i<8;i++){
		bigBodyOra[i]=new Image();
		bigBodyBlue[i]=new Image();
		bigBodyOra[i].src="./src/bigSwim"+i+".png";
		bigBodyBlue[i].src="./src/bigSwimBlue"+i+".png";
	}
	//字体状态
    ctx1.font="30px Verdana";
	ctx1.textAlign="center";
	ane=new aneObj();
	ane.init();

	fruit=new fruitObj();
	fruit.init();

	mom=new momObj();
	mom.init();

	baby=new babyObj();
	baby.init();

	data=new dataObj();
	wave=new waveObj();
	wave.init();
	halo=new haloObj();
	halo.init();
}

function gameloop(){
	requestAnimFrame(gameloop);
	var now=Date.now();
	deltaTime=now-lastTime;
	lastTime=now;
	if(deltaTime>40)
		deltaTime=40;
	drawBackground();

	ane.draw();

	fruit.draw();
	fruitMonitor();
	ctx1.clearRect(0,0,canWidth,canHeight);
	mom.draw();
	baby.draw();
	momFruitCollision();
	momBabyCollision();
	data.draw();
	wave.draw();
	halo.draw();
}
function onMouseMove(e){
	if(!data.gameOver){
	if(e.offSetX||e.layerX){
		mx=e.offSetX==undefined?e.layerX:e.offSetX;
		my=e.offSetY==undefined?e.layerY:e.offSetY;
	}
  }
}
