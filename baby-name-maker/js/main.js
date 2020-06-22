var RandomName = function () {
  var that = this;
  // 姓
  var firstName = "";
  var $btn = $("#btn");
  var $name = $("#name");

  // 存一份数据
  var jsonData = "";

  this.showBlack = function () {
    $("<div/>", {
      class: "black",
    }).appendTo("body");
  };
  this.removeBlack = function () {
    $(".black").remove();
  };

  // 随机选择名字显示在文本框内的效果
  this.run = function (data) {
    var names = data.split(" ");
    var index = Math.floor(Math.random() * names.length);
    $name.val(firstName + names[index].slice(1));
  };

  // 点击按钮后，滚动文字
  this.play = function (json) {
    if (json) {
      var play;
      if (!$btn.hasClass("played")) {
        $btn.addClass("played");
        play = setInterval(function () {
          that.run(json.data);
        }, 50);

        setTimeout(function () {
          clearInterval(play);
          $btn.removeClass("played");
        }, 1200);
      }
    }
  };

  // 获取姓名数据
  this.getData = function () {
    $.getJSON("data/" + firstName + ".txt")
      .success(function (json) {
        if (json.success) {
          that.play(json);
          jsonData = json;
          that.removeBlack();
        }
      })
      .error(function () {
        // 如果没有这个姓，就找通用的
        //$("#alert").show();
        $.getJSON("data/all.txt").success(function (json) {
          if (json.success) {
            that.play(json);
            jsonData = json;
            that.removeBlack();
          }
        });
      });
  };

  this.handle = function () {
    $btn.click(function () {
      var me = $(this);
      var searchValue = $.trim($name.val().slice(0, 1));
      if (searchValue == "") {
        return false;
      }

      // 如果和上次搜索的姓一样，则不拉新数据
      if (firstName == searchValue) {
        that.play(jsonData);
      } else {
        that.showBlack();
        firstName = searchValue;
        that.getData();
      }
    });

    $name.keypress(function (e) {
      if (e.keyCode == 13) {
        $btn.click();
      }
    });

    $("#alert span").click(function () {
      $("#alert").hide();
      that.removeBlack();
    });
  };
  this.init = function () {
    that.handle();
  };
};

var randomName = new RandomName();
randomName.init();
