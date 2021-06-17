const len = sentenceArray.length
function innerText(len, sentence) {
    let index = Math.abs(Math.floor(Math.random() * (len - 0)) + 0)
    sentence.innerText = sentenceArray[index] || '时间象奔腾澎湃的急湍，它一去无返，毫不流连。'
}
//全屏
function fullScreenHandle() {
    var element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    screenFull = true
    toggle(screenFull)
}

//退出全屏 
function exitFullscreenHandle() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    screenFull = false
    toggle(screenFull)
}
function changeColorHandle() {
    let random = parseInt(Math.random() * 360),
        random_warm = Math.abs(Math.floor(Math.random() * (175 - 0)) + 0),
        random_cool = Math.abs(Math.floor(Math.random() * (360 - 175)) + 175)
    document.body.style.backgroundColor = `hsl(${random}deg 100% 69%)`
    document.body.style.backgroundImage = `linear-gradient(${random}deg, hsl(${random_warm}deg 100% 69%), hsl(${random_cool}deg 100% 69%))`

}
let screenFull = false,
    fullScreen = null,
    exitFullScreen = null
window.onload = function () {
    // 设置背景色
    changeColorHandle()
    // 设置文案
    let sentence = document.getElementById('sentence')
    innerText(len, sentence)
    setInterval(() => {
        innerText(len, sentence)
    }, 1000 * 30)
    // 设置全屏
    fullScreen = document.getElementById('fullScreen')
    exitFullScreen = document.getElementById('exitFullScreen')
    fullScreen.addEventListener('click', fullScreenHandle, false)
    exitFullScreen.addEventListener('click', exitFullscreenHandle, false)
    // 设置年月日 .toLocaleString() || .toJson()
    let dateBox = document.getElementById('date')
    dateBox.innerText = new Date().toLocaleDateString().replace(/\//g, '.')
    // 换肤功能
    changeColor = document.getElementById('changeColor')
    changeColor.addEventListener('click', changeColorHandle, false)
}

//监听window是否全屏，并进行相应的操作,支持esc键退出
window.onresize = function () {
    var isFull = !!(document.webkitIsFullScreen || document.mozFullScreen ||
        document.msFullscreenElement || document.fullscreenElement
    );//!document.webkitIsFullScreen都为true。因此用!!
    toggle(isFull)
}
function toggle(isFull) {
    if (isFull == false) {
        exitFullScreen.style.display = "none";
        fullScreen.style.display = "";
    } else {
        exitFullScreen.style.display = "";
        fullScreen.style.display = "none";
    }
}

// 时钟代码
var Flipper = /** @class */ (function () {
    function Flipper(node, currentTime, nextTime) {
        this.isFlipping = false;
        this.duration = 500;
        this.flipNode = node;
        this.frontNode = node.querySelector(".front");
        this.backNode = node.querySelector(".back");
        this.setFrontTime(currentTime);
        this.setBackTime(nextTime);
    }
    Flipper.prototype.setFrontTime = function (time) {
        this.frontNode.dataset.number = time;
    };
    Flipper.prototype.setBackTime = function (time) {
        this.backNode.dataset.number = time;
    };
    Flipper.prototype.flipDown = function (currentTime, nextTime) {
        var _this = this;
        if (this.isFlipping) {
            return false;
        }
        this.isFlipping = true;
        this.setFrontTime(currentTime);
        this.setBackTime(nextTime);
        this.flipNode.classList.add("running");
        setTimeout(function () {
            _this.flipNode.classList.remove("running");
            _this.isFlipping = false;
            _this.setFrontTime(nextTime);
        }, this.duration);
    };
    return Flipper;
}());
var getTimeFromDate = function (date) {
    return date
        .toTimeString()
        .slice(0, 8)
        .split(":")
        .join("");
};
var flips = document.querySelectorAll(".flip");
var now = new Date();
var nowTimeStr = getTimeFromDate(new Date(now.getTime() - 1000));
var nextTimeStr = getTimeFromDate(now);
var flippers = Array.from(flips).map(function (flip, i) { return new Flipper(flip, nowTimeStr[i], nextTimeStr[i]); });
setInterval(function () {
    var now = new Date();
    var nowTimeStr = getTimeFromDate(new Date(now.getTime() - 1000));
    var nextTimeStr = getTimeFromDate(now);
    for (var i = 0; i < flippers.length; i++) {
        if (nowTimeStr[i] === nextTimeStr[i]) {
            continue;
        }
        flippers[i].flipDown(nowTimeStr[i], nextTimeStr[i]);
    }
}, 1000);