var canvas=document.querySelector(".container");
function gameStart(gameCfg){
	var mineIdArr=[];
	var boxNum=gameCfg.size*gameCfg.size;
	var flagNum = 0;
	//初始化；
	canvas.style.width=gameCfg.size*gameCfg.boxWidth+"px";
	canvas.style.height=gameCfg.size*gameCfg.boxWidth+"px";
	canvas.style.marginLeft=-1*gameCfg.size*gameCfg.boxWidth/2+"px";
	document.querySelector(".mineSum")
		.style.marginLeft=-1*gameCfg.size*gameCfg.boxWidth/2+"px";
	document.querySelector(".flagNum")
		.style.marginLeft=-1*gameCfg.size*gameCfg.boxWidth/2+"px";
	for(var x=0;x<gameCfg.size;x++){
		for(var y=0;y<gameCfg.size;y++){
			var outer=document.createElement("div");
			var front=document.createElement("div");
			var back=document.createElement("div");
			outer.className="mineBox";
			front.className="front";
			back.className="back";
			outer.appendChild(front);
			outer.appendChild(back);
			canvas.appendChild(outer);
		}
	}
	var mineBox = document.querySelectorAll(".mineBox");
	var back = document.querySelectorAll(".back");
	var front = document.querySelectorAll(".front");
	mineBox.forEach(function (item){
		item.setAttribute("data-isMine",false)
		item.style.width=gameCfg.boxWidth+"px";
		item.style.height=gameCfg.boxWidth+"px";
	})
	back.forEach(function(item){
		item.setAttribute("data-reverse",false)
	})
	
	//添加地雷；
	for(var i=0;i<gameCfg.mineNum;i++){
		createMine()
	}
	mineIdArr.forEach(function(item,index){
		if(item){
			mineBox[item].setAttribute("data-isMine",true)
			mineBox[item].querySelector(".back").className+=" isMine";
			mineBox[item].querySelector(".back").innerHTML = "<img src='mine.jpg'>"
		}
	});
	
	//周围地雷检测;
	for(var i=0;i<boxNum;i++){
		if(!isMine(i)){
			var n=0;
			if(i%gameCfg.size != 0){
				isMine(i-1) && n++;
				isMine(i+gameCfg.size-1) && n++;
				isMine(i-gameCfg.size-1) && n++;
			}
			if(i%gameCfg.size != gameCfg.size-1){
				isMine(i+1) && n++;
				isMine(i+gameCfg.size+1) && n++;
				isMine(i-gameCfg.size+1) && n++;
			}
			isMine(i-gameCfg.size) && n++;
			isMine(i+gameCfg.size) && n++;
			back[i].className+=" mineNum"+n;
			back[i].innerHTML= (n==0 ? "" : n);
		}
	}
	//地雷检测
	function isMine(i){
		if(i>=0 && i<boxNum){
			if(mineBox[i].getAttribute("data-isMine")=="true"){
				return true
			}
		}
	}
	function createMine(){
		var mineId = parseInt(Math.random()*(gameCfg.size*gameCfg.size));
		for(var i=0;i<mineIdArr.length;i++){
			if(mineId == mineIdArr[i]){
				createMine();
				return false;
			}
		}
		mineIdArr.push(mineId)
		return mineId;
	}

	//游戏规则设计
	//当点击到雷时过0.5s显示模态框

	document.querySelector(".model button").onclick=function(){
		document.querySelector(".model").style.display="none";
		window.location.href=window.location.href
	}
	//添加点击反转事件；
	canvas.oncontextmenu=function(){
		return false
	}
	var flagArr=[];
	canvas.onmousedown=function(e){
		if(e.button==0){
			if(e.target.className=="front"){
				for(var i=0;i<boxNum;i++){
					if(e.target==front[i]){
						show(i)
					}
				}
				if(e.target.parentNode.getAttribute("data-isMine")=="true"){
					gameOver("GAME OVER")
				}
			}
		}
		if(e.button==2){
			if(e.target.className=="front"){
				for(var i=0;i<boxNum;i++){
					if(e.target==front[i]){
						var that=front[i]
						if(!flagArrHasNum(i)){
							flagNum++;
							document.querySelector(".flagNum span").innerHTML = flagNum;
							that.style.background="url('flagsmall.jpg')";
							flagArr.push(i)
						}else{
							flagNum--;
							document.querySelector(".flagNum span").innerHTML = flagNum;
							that.style.background="#666";
							flagArr = flagArr.remove(i)
						}
						if(isWin()){
							gameOver("YOU WIN")
						}
					}
				}
			}
		}
	}
	Array.prototype.remove=function(elem){
		var arr=[]
		for(var i=0;i<this.length;i++){
			if(this[i]!=elem){
				arr.push(this[i])
			}
		}
		return arr
	}

	function isWin(){
		if(mineIdArr.length==flagArr.length){
			for(var j=0;j<flagArr.length;j++){
				//如果检查后没有该数字就返回false;
				if(!mineArrHasNum(flagArr[j])){
					return false
				}
			}
			return true;
		}
		return false;
	}
	function mineArrHasNum(num){
		for(var i=0;i<mineIdArr.length;i++){
			if(mineIdArr[i]==num){
				return true;
			}
		}
	}
	function flagArrHasNum(num){
		for(var i=0;i<flagArr.length;i++){
			if(flagArr[i]==num){
				return true;
			}
		}
	}
	//添加迭代发生；

	function show(i){
		if(i>=0 && i<boxNum){
			setTimeout(function(){
				if(back[i].getAttribute("data-reverse")=="false"){
					front[i].style.transform="rotateY(180deg)";
					back[i].style.transform="rotateY(0deg)";
					back[i].setAttribute("data-reverse",true);
					var num = back[i].innerHTML;
					if(num==0){
						if(i%gameCfg.size != 0){
							show(i-gameCfg.size-1)
							show(i+gameCfg.size-1)
							show(i-1)
						}
						if(i%gameCfg.size != gameCfg.size-1){
							show(i+gameCfg.size+1)
							show(i-gameCfg.size+1)
							show(i+1)
						}
						show(i+gameCfg.size)
						show(i-gameCfg.size)
					}
				}
			},100)
		}
	}

	function gameOver(type){
		canvas.onclick=null
		if(type=="GAME OVER"){
			document.querySelector(".model div").style.background="#333";
			document.querySelector(".model button").style.color="#333"
			for(var i=0;i<boxNum;i++){
				front[i].style.transform="rotateY(180deg)";
				back[i].style.transform="rotateY(0deg)";
			}
		}
		document.querySelector(".model h2").innerHTML=type;
		setTimeout(function(){
			document.querySelector(".model").style.display="block";
		},300)	
	}
}

document.querySelector(".input button").onclick=function(){
	var mineNum;
	var size;
	var flagNum = 0;
	function startOk(){
		mineNum = parseInt(document.querySelectorAll("input")[0].value);
		size = parseInt(document.querySelectorAll("input")[1].value);
		if(mineNum<(size*size) && size<=20){
			return true;
		}else{
			alert("输入的数量不合适,输入的战场大小应该小于20,雷的数量应该小于战场大小的平方")
		}
	}
	if(startOk()){
		document.querySelector(".mineSum span").innerHTML = mineNum;
		document.querySelector(".flagNum span").innerHTML = flagNum;
		document.querySelector(".input-model").style.display = "none";
		var gameCfg={
			size:size,
			boxWidth:40,
			mineNum:mineNum
		};
		gameStart(gameCfg);
	}
}