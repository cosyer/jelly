// 这么写会报错，因为这是一个函数定义：解析器无法识别
// function() { } ()

// 常见的（多了一对括号），调用匿名函数：
// (function () { })()

// /但在前面加上一个布尔运算符（只多了一个感叹号），就是表达式了，将执行后面的代码，也就合法实现调用
// !function () { }()
!function () {
  // 重置
  window.n = null;
  var duration = 50;
  var controller = false;
  $(".actions").on("click", "button", function (e) {
    let $button = $(e.currentTarget); // button
    let speed = $button.attr("data-speed");
    $button.addClass("active").siblings(".active").removeClass("active");
    switch (speed) {
      case "slow":
        duration = 100;
        break;
      case "normal":
        duration = 50;
        break;
      case "fast":
        duration = 10;
        break;
      case "switch":
        controller = !controller;
        $button[0].innerHTML = controller ? "暂停" : "开始";
        if (controller) {
          writeCode("", code);
        }
        break;
    }
  });
  function writeCode(prefix, code, fn) {
    let container = document.querySelector("#code");
    let styleTag = document.querySelector("#styleTag");
    let n = window.n ? window.n : 0;
    let id;
    if (controller) {
      id = setTimeout(function run() {
        n += 1;
        window.n = n;
        container.innerHTML = code.substring(0, n);
        styleTag.innerHTML = code.substring(0, n);
        container.scrollTop = container.scrollHeight;
        if (n < code.length && controller) {
          id = setTimeout(run, duration);
        } else {
          fn && fn.call();
        }
      }, duration);
    }
  }
  let code = `/*
 * 首先，需要准备皮卡丘的皮
 */
.preview{
  background: #FEE433;
}
/*
 * 接下来，画皮卡丘的鼻子
 */
.nose{
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 12px;
  border-color: black transparent transparent;
  border-radius: 11px;
  position: absolute;
  left: 50%;
  top: 28px;
  margin-left: -12px;
}
/*
 * 接下来，画皮卡丘的眼睛
 */
.eye{
  width: 49px;
  height: 49px;
  background: #2E2E2E;
  position: absolute;
  border-radius: 50%;
  border: 2px solid #000000;
}
/*
 * 眼睛里面的珠子
 */
.eye::before{
  content: '';
  display: block;
  width: 24px;
  height: 24px;
  background: white;
  position: absolute;
  border-radius: 50%;
  left: 6px;
  top:-1px;
  border: 2px solid #000;
}
/*
 * 左眼在左边（废话）
 */
.eye.left{
  right: 50%;
  margin-right: 90px;
}
/*
 * 右眼在右边（废话）
 */
.eye.right{
  left: 50%;
  margin-left: 90px;
}
/*
 * 然后，画皮卡丘的脸
 */
.face{
  width: 68px;
  height: 68px;
  background: #FC0D1C;
  border: 2px solid black;
  border-radius: 50%;
  position: absolute;
  top: 85px;
}
/*
 * 将脸放到正确的位置
 */
.face.left{
  right: 50%;
  margin-right: 116px;
}
.face.right{
  left: 50%;
  margin-left: 116px;
}
/*
 * 上嘴唇
 */
.upperLip{
  height: 25px;
  width: 80px;
  border: 2px solid black;
  position: absolute;
  top: 50px;
  background: #FDE348;
}
.upperLip.left{
  right: 50%;
  border-bottom-left-radius: 40px 25px;
  border-top: none;
  border-right: none;
  transform: rotate(-20deg);
}
.upperLip.right{
  left: 50%;
  border-bottom-right-radius: 40px 25px;
  border-top: none;
  border-left: none;
  transform: rotate(20deg);
}
/*
 * 下嘴唇
 */
.lowerLip-wrapper{
  bottom: 0;
  position: absolute;
  left: 50%;
  margin-left: -150px;
  height: 110px;
  overflow: hidden;
  width: 300px;
}
.lowerLip{
  height: 3500px;
  width: 300px;
  background: #990513;
  border-radius: 200px/2000px;
  border: 2px solid black;
  position: absolute;
  bottom: 0;
  overflow: hidden;
}
/*
 * 小舌头
 */
.lowerLip::after{
  content: '';
  position: absolute;
  bottom: -20px;
  width: 100px;
  height: 100px;
  background: #FC4A62;
  left: 50%;
  margin-left: -50px;
  border-radius: 50px;
}
/*
 * 好了，这只皮卡丘送给你
 */
`;
  writeCode("", code);
}.call();
