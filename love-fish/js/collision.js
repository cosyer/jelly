//判断大鱼和果实的距离
function momFruitCollision(){
	if(!data.gameOver){
	for(var i=0;i<fruit.num;i++){
		if(fruit.alive[i]){
			var l=calLength2(fruit.x[i],fruit.y[i],mom.x,mom.y);//计算两者间距离的平方
			if(l<900){
				fruit.dead(i);//果实被吃死亡
				data.fruitNum++;
				mom.bigBodyCount++;
				wave.born(fruit.x[i],fruit.y[i]);
				if(mom.bigBodyCount>7)
					mom.bigBodyCount=7;
				if(fruit.fruitType[i]=="blue"){
					data.double=2;
				}
			}
		}
	}
  }
}
//小鱼和大鱼的碰撞检测
function momBabyCollision(){
	if(data.fruitNum>0&&!data.gameOver){
	var l=calLength2(mom.x,mom.y,baby.x,baby.y);
	if(l<900){
		//小鱼回复最初状态
		baby.babyBodyCount=0;
		mom.bigBodyCount=0;
		halo.born(baby.x,baby.y);
		// data.reset();
		data.addScore();
	}
  }
}