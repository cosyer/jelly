let id;

!function() {
  let duration = 5;

  function writeCode(prefix, code, fn) {
    let container = document.querySelector("#code");
    let styleTag = document.querySelector("#styleTag");

    let n = 0;

    id = setTimeout(function run() {
      n += 1;
      container.innerHTML = code.substring(0, n);
      styleTag.innerHTML = code.substring(0, n);

      container.scrollTop = container.scrollHeight;

      if (n < code.length) {
        id = setTimeout(run, duration);
      } else {
        fn && fn.call();
      }
    }, duration);
  }

  $(".actions").on("click", "button", function(event) {
    let container = $("#code");
    let styleTag = $("#styleTag");

    let $button = $(event.currentTarget); // Button
    let speed = $button.attr("data-speed");

    $button
      .addClass("active")
      .siblings(".active")
      .removeClass("active");

    switch (speed) {
      case "slow":
        duration = 50;
        break;
      case "medium":
        duratoin = 10;
        break;
      case "fast":
        duration = 5;
        break;
      case "skip":
        // Stop typing
        window.clearTimeout(id);
        // Set codes to tag
        container.html(code);
        styleTag.html(code);
        break;
      default:
        break;
    }
  });

  let code = `
body {
  background-color:#EBD8D0;
}
#container{  
  margin: 120px auto;
  position: relative;
  height:230px;
  width:754px;
}
#container div{
   position:absolute;  
}
#container div::before, #container div::after {
   content:'';
   position:absolute;
  display:block;
}
.body {   
  width:300px;
  height:150px;
  background: #594a41;
  left:228px;
  border-radius:50%;
  bottom:29px;
}
.muzzle { 
  z-index:5;
  width: 152px;
  height: 70px;
  bottom:30px;
  left:143px;
  background:#A78A7F;  
  border-radius:100%;    
}
.head { 
  z-index:10;
  width: 152px;
  height: 70px;
  bottom:32px;
  left:143px;
  background:#A78A7F;  
  border-radius:100%;    
}
.head::before {
  width:122px;
  height:122px;
  left:54px;
  bottom:0px;
  z-index:199;
  background: #594a41;   
  border-radius: 90% 50% 90% 90%;
  transform: rotateZ(226deg); 
}
.ears{  
  width:42px;
  height:42px;
  background: #594a41;
  border-radius: 100%;
  left: 220px;
  top:60px;
  box-shadow: 34px -8px 0 0 #594a41
}
.tail{  
  width:50px;
  height:50px;
  background: #594a41;
  border-radius: 100%;
  left: 490px;
  top:60px;
}
.paws-front{
  z-index:15;
  background: #A78A7F;
  width:100px;
  height:50px;
  bottom:14px;
  left:272px;
  -webkit-border-radius: 
    80% 22% 55% 50% / 55% 22% 80% 50%;
  border-radius: 
    80% 22% 55% 50% / 55% 22% 80% 50%;
  -webkit-transform: rotateZ(12deg);
  transform: rotateZ(12deg);
}
.paws-back{
 width:100px;
  height:52px;
  border-top-left-radius: 100%;
  background: #A78A7F;
  left:420px;
  bottom:29px;
}
.paws-back::after {  
  width:36px;
  height:52px;
  border-radius:100%;
  left:80px;
  background:#A78A7F;
}
.details{
  width:25px;
  height:25px;
  background:#221E22;
  border-radius:100%;
  z-index:20;
  box-shadow: 100px 0 0 #AD5D4E;
  bottom:66px;
  left:135px;
}
.details::after {  
  width:22px;
  height:22px; 
  border-bottom: 5px solid #221E22;
	border-top: 5px solid transparent;
	border-left: 5px solid transparent;
	border-right: 5px solid transparent;
  border-radius:50%;  
  left:68px;
  top:-30px;  
}
/* -- ZZZzzzz -- */
.sleep {
  height: 90px;
  width: 80px;
  position: absolute;
  left: 80px;
  top: 30px;
  font-size:55px;
}
@keyframes zz {
  0% {opacity: 0; transform: scale3d(.2, .2, .2) rotate(-20deg);}
  50% {opacity: 1;}
  80% {transform: translateY(-30px) translateX(20px) rotate(10deg); opacity: 0;}
  100% {opacity:0;}
}
.sleep span {
  width: 15px;
  height: 15px;
  display: block;
   color: #221E22;
  font-family: arial;
  font-weight: bold;
  text-align: center;
  line-height: 20px;
}
.sleep span {animation: zz 3s linear infinite}
.sleep .s1 {margin-left: 180px; margin-top:-40px}
.sleep .s2 {margin-left: 120px; margin-top: -5px;}
.sleep .s3 {margin-left: 60px; margin-top: 5px;}
.sleep .s4 {margin-left: 0px; margin-top: 12px;}
.sleep .s5 {margin-left: -5px; margin-top: 52px;}`;
  writeCode("", code);
}.call();
