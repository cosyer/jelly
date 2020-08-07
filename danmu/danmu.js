/*
Usage: 
createdm('main','233','red','auto','normal');
createdm('main','真的吗？我真的好高兴啊！','green','auto','normal');
createdm('main','真的吗？我真的好高兴啊！','white','auto','top');
createdm('main','真的吗？我真的好高兴啊！','white','auto','bottom');
*/
function theworld() {
  window.dmpause = "yes";
}
function continuedm() {
  window.dmpause = "no";
}
function createdm(e, txt, colors, speed, position) {
  if (
    document.getElementById(e) !== null &&
    document.getElementById(e) !== undefined
  ) {
    if (window.danmu == null) {
      window.danmu = 0;
      window.dmrow = 1;
      window.topdmrow = 1;
      window.bottomrow = 1;
    }
    var gete = document.getElementById(e);
    //gete.style.zIndex=0;
    gete.style.overflow = "hidden";
    gete.style.position = "relative";
    var dm = document.createElement("div");
    var text = document.createTextNode(txt);
    dm.appendChild(text);
    dm.id = "dm" + window.danmu;
    gete.appendChild(dm);
    gete.style.wordBreak = "keep-all";
    var gdm = document.getElementById("dm" + window.danmu);
    gdm.style.wordBreak = "keep-all";
    gdm.style.whiteSpace = "nowrap";
    gdm.style.color = colors;
    if (position == "normal") {
      widths = gete.clientWidth;
      gdm.style.left = widths + "px";
      gdm.style.fontSize = widths / 40 + "px";
      gdm.style.top = parseInt(gdm.style.fontSize) * window.dmrow;
      gdm.style.zIndex = 1 + window.danmu;
      gdm.style.position = "absolute";
      var tlen = txt.length;
      scrolling(widths, "dm" + window.danmu, speed, tlen); /*弹幕滚动函数*/
      window.dmrow += 1;
    } else if (position == "top") {
      widths = gete.clientWidth;
      gdm.style.position = "absolute";
      gdm.style.fontSize = widths / 40 + "px";
      gdm.style.width = widths;
      gdm.style.left = "0px";
      gdm.style.top = parseInt(gdm.style.fontSize) * window.topdmrow;
      gdm.style.margin = "0 auto";
      gdm.style.textAlign = "center";
      gdm.style.zIndex = 1 + window.danmu;
      window.topdmrow += 1;
      pausef("dm" + window.danmu, speed);
    } else if (position == "bottom") {
      widths = gete.clientWidth;
      gdm.style.position = "absolute";
      gdm.style.fontSize = widths / 40 + "px";
      gdm.style.width = widths;
      gdm.style.left = "0px";
      gdm.style.bottom = parseInt(gdm.style.fontSize) * window.bottomrow;
      gdm.style.margin = "0 auto";
      gdm.style.textAlign = "center";
      gdm.style.zIndex = 1 + window.danmu;
      window.bottomrow += 1;
      pausef("dm" + window.danmu, speed);
    }
    window.danmu += 1;
    if (window.topdmrow >= 10) {
      window.topdmrow = 1;
    }
    if (window.bottomrow >= 10) {
      window.bottomrow = 1;
    }
    if (window.dmrow >= 20) {
      window.dmrow = 1;
    }
  }
}
function scrolling(ml, e, speed, len) {
  var gdm = document.getElementById(e);
  var moveper = 0.3;
  if (speed == "auto") {
    moveper += len / ml + 0.2 * len;
    if (moveper <= 1.8) {
      /*保底速度*/
      moveper = 1.8;
    }
  } else {
    moveper += Number(speed) * 1;
    if (moveper <= 1.8) {
      moveper = 1.8;
    }
  }
  function animate(mp, s) {
    if (
      document.getElementById(s) !== null &&
      document.getElementById(s) !== undefined
    ) {
      var gdm = document.getElementById(s);
      if (window.dmpause !== "yes") {
        //方便暂停
        gdm.style.left = parseInt(gdm.style.left) - mp + "px";
      }
      if (
        parseInt(gdm.style.left) + parseInt(gdm.style.fontSize) * 4 <=
        -105 * mp
      ) {
        gdm.parentNode.removeChild(gdm);
        clearInterval(t);
      }
    }
  }
  var t = setInterval(function () {
    animate(moveper, e);
  }, 20);
}
function pausef(e, s) {
  //顶部和尾部暂停弹幕
  if (s == "auto") {
    s = 5;
  }
  var gdm = document.getElementById(e);
  function premove(e) {
    if (
      document.getElementById(e) !== null &&
      document.getElementById(e) !== undefined
    ) {
      if (window.dmpause !== "yes") {
        //方便暂停
        s -= 1;
      }
      if (s <= 0) {
        var gdm = document.getElementById(e);
        gdm.parentNode.removeChild(gdm);
        clearInterval(t);
      }
    }
  }
  var t = setInterval(function () {
    premove(e);
  }, 1000);
}
