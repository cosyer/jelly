'use strict';

function Clock($ct, w, h) {
    this.init($ct, w, h);
    this.autoPlay();

}

Clock.prototype.init = function($ct, w, h) {
    //初始化的时候挂载属性,默认class=clock;
    w = w || 500;
    h = h || 500;
    $ct = $ct || $("body");

    this.$clock = $("<div class='clock'>" +
        "<canvas id='clock-canvas' width=" + w + " height=" + h + ">" +
        "不支持canvas！！！" +
        "</canvas>" +
        "</div>");

    this.clock = this.$clock.find("#clock-canvas")[0];
    this.ctx = this.clock.getContext('2d');
    this.clockImage = new Image(); //背景图
    this.stop = null; //控制动画
    this.rad = w / 2; //获得表盘半径

    this.clockImage.src="./img/125855_nnla_89964.png";
    $ct.append(this.$clock);
}

Clock.prototype.initNum = function(fontSize) { //把刻度关键时间1,2...12画上去,内部方法

    let ctx = this.ctx;

    if (fontSize) {
        ctx.font = fontSize + "px Arial";
    } else {
        ctx.font = "36px Arial";
    }
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

}
Clock.prototype.clear = function() { //内部方法

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
}

Clock.prototype.draw = function(date) {

    let ctx = this.ctx;
    let rad = this.rad;
    let canvas = this.clock;
    let clockImage=this.clockImage;

    this.clear(); //清空画板

    date = date || new Date();
    //获得时间的数值
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    hours = hours > 12 ? hours - 12 : hours; //12小时制
    let hour = hours + minutes / 60; //计算时针的偏移量
    let minute = minutes + seconds / 60; //计算分钟的偏移量

    ctx.save(); //保存当前设置也就是画板的设置为初始值

    ctx.drawImage(clockImage, 0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.translate(canvas.width / 2, canvas.height / 2); //移动画板原点到画板中心，方便画图
    ctx.beginPath();

    this.initNum(); //设置数值的长相

    //开始画刻度
    for (let i = 1; i <= 12; i++) {
        //获得正确的转动弧度
        let radia = (i - 3) * (Math.PI * 2) / 12;
        //获正确的x轴
        let x = Math.cos(radia) * rad * 0.7; //0.7系数是为了防止数值定格
        let y = Math.sin(radia) * rad * 0.7;

        ctx.fillText(i, x, y);
    }

    //开始画时钟
    ctx.save();
    let theta = (hour - 3) * 2 * Math.PI / 12;
    ctx.rotate(theta);
    ctx.beginPath();
    ctx.moveTo(-15, -5);
    ctx.lineTo(-15, 5);
    ctx.lineTo(rad * 0.5, 1);
    ctx.lineTo(rad * 0.5, -1);
    ctx.fill();
    ctx.restore();

    //开始画分钟
    ctx.save();
    theta = (minute - 15) * 2 * Math.PI / 60;
    ctx.rotate(theta);
    ctx.beginPath();
    ctx.moveTo(-15, -4);
    ctx.lineTo(-15, 4);
    ctx.lineTo(rad * 0.6, 1);
    ctx.lineTo(rad * 0.6, -1);
    ctx.fill();
    ctx.restore();

    //开始画秒针
    ctx.save();
    theta = (seconds - 15) * 2 * Math.PI / 60;
    ctx.rotate(theta);
    ctx.beginPath();
    ctx.moveTo(-15, -3);
    ctx.lineTo(-15, 3);
    ctx.lineTo(rad * 0.7, 1);
    ctx.lineTo(rad * 0.7, -1);
    // ctx.fillStyle = 'red';

    ctx.fill();
    ctx.restore();

    //回归最初的设置

    ctx.restore();
}

Clock.prototype.autoPlay = function() {
    let _this = this;
    setInterval(function() {
        _this.draw();
    }, 1000);
}
