//获取url参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return r[2];
  return null;
}
window.onload = function() {
  var l = GetQueryString("l"),
    g = GetQueryString("g");
  if (l != null && g != null) {
    var numberArr = [
      712895075,
      713154109,
      712962228,
      712548898,
      712269093,
      713069144,
      713219979,
      713209612,
      711367725,
      713078283,
      712486991,
      713158521,
      712610488,
      712757268,
      711683171,
      713221183,
      69793385,
      712867411,
      713275739,
      711853549,
      712382213,
      711815841,
      712909505,
      711378492,
      711793090,
      712546437,
      710668292,
      712787442,
      713181408,
      710996370,
      713094890,
      712019461,
      712268585,
      712217409,
      712665381,
      711865857,
      713348353,
      6886564,
      713295950,
      713088300,
      712146900,
      712293512,
      712887781,
      713243993
    ];
    var nameArr = [
      "测试人1",
      "测试人2",
      "测试人3",
      "测试人4",
      "测试人5",
      "测试人6",
      "测试人7",
      "测试人8",
      "测试人9",
      "测试人10",
      "测试人11",
      "测试人12",
      "测试人13",
      "测试人14",
      "测试人15",
      "测试人16",
      "测试人17",
      "测试人18",
      "测试人19",
      "测试人20",
      "测试人21",
      "测试人22",
      "测试人23",
      "测试人24",
      "测试人25"
    ];
    var areaArr = [
      "江苏省",
      "山东省",
      "福建省",
      "浙江省",
      "广东省",
      "吉林省",
      "湖南省",
      "广西壮族自治区",
      "陕西省",
      "北京市",
      "黑龙江省",
      "内蒙古自治区",
      "辽宁省",
      "河南省",
      "山西省",
      "甘肃省"
    ];
    var phoneArr = [
      "（159****1213）",
      "（151****1113）",
      "（152****1311）",
      "（159****1523）",
      "（159****1663）",
      "（154****1215）",
      "（152****1217）",
      "（152****1410）",
      "（154****1263）",
      "（159****1225）",
      "（156****1663）",
      "（147****1215）"
    ];
    var numberLen = numberArr.length,
      nameLen = nameArr.length,
      areaLen = areaArr.length,
      phoneLen = phoneArr.length;
    var timers = (t = null),
      c = 0,
      rNumerIndex,
      rNameIndex,
      rAreaIndex,
      rPhoneIndex;

    //显示动画效果
    function liffect(t) {
      if (t == undefined) t = 0;
      $("ul[data-liffect] li").each(function(i) {
        $(this).attr(
          "style",
          "-webkit-animation-delay:" +
            i * t +
            "ms;" +
            "-moz-animation-delay:" +
            i * t +
            "ms;" +
            "-o-animation-delay:" +
            i * t +
            "ms;" +
            "animation-delay:" +
            i * t +
            "ms;"
        );
        if (i == $("ul[data-liffect] li").size() - 1) {
          $("ul[data-liffect]").addClass("play");
        }
      });
    }

    if (l > 3) {
      $("#winningListA").show();
      liffect();
    } else {
      $("#winningListA").hide();
      $("#winningListB").show();
    }

    //开始 暂停
    $(".sBtn").click(function() {
      var thisId = $(this).attr("id");
      if (thisId == "start") {
        $(this)
          .attr("id", "stop")
          .text("停止");
        thisId = "stop";
        clearTimeout(t);
        t = setTimeout(function() {
          if (l > 3) {
            if (timers == undefined) {
              timers = setInterval(function() {
                $("#winningListA .wList li").each(function() {
                  rNumerIndex = Math.floor(Math.random() * numberLen);
                  rNameIndex = Math.floor(Math.random() * nameLen);
                  rAreaIndex = Math.floor(Math.random() * areaLen);
                  $(this)
                    .find(".name")
                    .text(nameArr[rNameIndex]);
                  $(this)
                    .find(".serial_bumber")
                    .text(numberArr[rNumerIndex]);
                  $(this)
                    .find(".area")
                    .text(areaArr[rAreaIndex]);
                });
              }, 30);
            }
          } else {
            if (timers == undefined) {
              timers = setInterval(function() {
                rNumerIndex = Math.floor(Math.random() * numberLen);
                rNameIndex = Math.floor(Math.random() * nameLen);
                rAreaIndex = Math.floor(Math.random() * areaLen);
                rPhoneIndex = Math.floor(Math.random() * phoneLen);
                $("#winningListB .wList .name").text(nameArr[rNameIndex]);
                $("#winningListB .wList .serial_number").text(
                  numberArr[rNumerIndex]
                );
                $("#winningListB .wList .area").text(areaArr[rAreaIndex]);
                $("#winningListB .wList .phone").text(phoneArr[rPhoneIndex]);
              }, 30);
            }
          }
        }, 300);
      } else {
        $(this)
          .attr("id", "start")
          .text("开始");
        thisId = "start";
        clearInterval(timers);
        $(".sBtn").hide();
        if (l > 3) {
          $("#winningListA").show();
        } else {
          $("#winningListB").show();
        }
      }
    });
  }

  $("#mainMenus li a.jName").click(function() {
    if (
      !$(this)
        .parent()
        .hasClass("active")
    ) {
      $("#mainMenus li").removeClass("active");
      $(this)
        .parent()
        .addClass("active");
    } else {
      $(this)
        .parent()
        .removeClass("active");
    }
  });
};
