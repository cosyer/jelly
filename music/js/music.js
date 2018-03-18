class Music {
    constructor(id) {

        if(id!==0&&!id){
          id="player"+(new Date().getTime());
        }
        this.initMusic(id);
        this.initAtter(id);
        //初始化过程
        this.getChannels();
        this.bindEvent();
        Music.setDrag(this.$musicPlay);
        this.play.play();
    }

    initMusic(id){//初始化界面
      let html=`<audio id="${id}" src="http://mr7.doubanio.com/2b2e6a3b7e27288c84cfc0498e867d48/0/fm/song/p345667_128k.mp4"></audio>
      <div class="music-play" id="music-play-${id}">
          <div class="music-icon">
              <i class="music-center fa fa-music fa-2x"></i>
          </div>
          <div class="music-content clear-fix">
              <ul class="music-menu">
              </ul>
              <div class="music-content-main">
                  <ul class="music-content-header clear-fix">
                      <li class="music-content-header-top"></li>
                      <li class="music-menu-icon">
                          <i class="fa fa-list-ul fa-1x"></i>
                      </li>
                      <li class="music-title">风居住的街道</li>
                      <li class="music-author" title="作者相关信息">
                          <i class="fa fa-leaf"></i>
                          <span class="author"> create by adam</span>
                      </li>
                  </ul>
                  <ul class="music-lyric music-picture-rotat">
                  </ul>
                  <div class="music-console">
                      <div class="music-start">
                          <i class="fa fa-play fa-2x music-center j-music-icon"></i>
                      </div>
                      <ul class="music-console-main clear-fix">
                          <li class="music-pre">
                              <i class="fa fa-backward"></i>
                          </li>
                          <li class="music-time music-time-currtime">
                          </li>
                          <li class="music-progress clear-fix">
                              <div class="music-progress-start"></div>
                              <div class="music-progress-end"></div>
                          </li>
                          <li class="music-time music-time-endtime">
                          </li>
                          <li class="music-volume">
                              <div class="music-volume-progress">
                                  <div class="music-volume-time-end music-volume-time">

                                  </div>
                                  <div class="music-volume-tag">

                                  </div>
                                  <div class="music-volume-time-start music-volume-time">

                                  </div>
                              </div>
                              <i class="fa fa-volume-up j-volume-icon"></i>
                          </li>
                          <li class="music-next">
                              <i class="fa fa-forward"></i>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>`;
      $("body").append($(html));
    }
    initAtter(id){
      this.$play = $("#"+id); //这是真实的播放器,jq版本
      this.play = this.$play[0]; //还原成原生的元素
      this.$musicPlay = $("#music-play-"+id); //获得假的播放器的整体

      this.$musicContent = this.$musicPlay.find(".music-content");
      this.$musicTag=this.$musicPlay.find(".music-icon");

      this.$menuIcon = this.$musicPlay.find(".music-menu-icon"); //菜单标记
      this.$musicMenu = this.$musicPlay.find(".music-menu"); //真实的菜单栏

      this.$currtime = this.$musicPlay.find(".music-time-currtime"); //获得播放开始的时间
      this.$endtime = this.$musicPlay.find(".music-time-endtime"); //获得播放结束的时间

      this.$musicProgress = this.$musicPlay.find(".music-progress"); //获得总播放的进度条
      this.$progressStart = this.$musicProgress.find(".music-progress-start"); //获得已经播放的进度条
      this.$progressEnd = this.$musicProgress.find(".music-progress-end"); //获得未播放的进度条

      this.$musicVolume = this.$musicPlay.find(".music-volume"); //获得音量这边区域的元素
      this.$volumeIcon = this.$musicVolume.find(".j-volume-icon"); //获得音量的图标
      this.$volumeProgress = this.$musicVolume.find(".music-volume-progress"); //获得音量进度条区域
      this.$volumeStart = this.$musicVolume.find(".music-volume-time-start"); //获得当前音量
      this.$volumeEnd = this.$musicVolume.find(".music-volume-time-end"); //获得剩余音量
      this.$volumeTag = this.$musicVolume.find(".music-volume-tag"); //获得调节音量的标志

      //获得剩余需要操作的DOM
      this.$musicIcon = this.$musicPlay.find(".j-music-icon"); //获得播放或者暂停的图标
      this.$musicPre = this.$musicPlay.find(".music-pre"); //上一曲
      this.$musicNext = this.$musicPlay.find(".music-next"); //下一曲

      //获得要操作的歌词和标题
      this.$musicTitle = this.$musicPlay.find(".music-title");
      this.$musicLyric = this.$musicPlay.find(".music-lyric");

      //设置一些状态变量
      this.state = false; //false表示状态未播放
      this.volumeDrag = false; //false表示不需要拖动音量标签
      this.animating=false;//双击的动画锁
      this.barLinking=false;//侧边菜单锁



      this.songList = []; //音乐列表
      this.lyTime = []



      this.noLyric = "此曲目为纯音乐";
      this.currChannel = "0";

      //获得一些需要知道的固定量
      this.musicWidth = this.$musicProgress.width(); //200px 注意这边进度条还有1px的左右border
      this.volumeHeight = this.$volumeProgress.height(); //100px
      this.volumeTagH = this.$volumeTag.height();
      this.songNum = 3; //最大缓存歌曲数量
      this.errorMessage = "没有更多的歌曲了~";
    }
    //开始是一些内部的工具方法
    timeFormat(time){
      //参数必须是整数~
      let m = Math.floor(time / 60);
      let s = Math.ceil(time) - m * 60;

      if (m > 60 || m < 0) {
          throw new Error("illegal arguments about time");
      }

      m < 10 ? m = "0" + m : m;
      s < 10 ? s = "0" + s : s;

      return m + ":" + s;
    }
    //根据百分比调整播放进度条
    MprogressChange(percent) {

        if (percent < 0 || percent > 1) {
            throw new Error("illegal arguments about percent");
        }

        let start = percent * this.musicWidth;
        let end = this.musicWidth - start;

        this.$progressStart.width(start);
        this.$progressEnd.width(end);
    }
    //根据百分比调整音量进度条
    vProgressChange(percent) {
        let H=this.volumeHeight - this.volumeTagH
        if (percent < 0 || percent > 1) {
            throw new Error("illegal arguments about percent");
        }

        let start = percent * H;
        let end =H - start;

        this.$volumeStart.height(start);
        this.$volumeEnd.height(end);

    }
    //逐次逼近，二分搜索,工具方法，迭代做的
    searchBinary(array, target, deviation, start, end) {
        //找到就返回索引值,没找到就是-1(gg)
        deviation = deviation||0;
        start = start||0;
        end = end||array.length - 1;
        while (end - start > 1) {
            let middle = Math.ceil((start + end) / 2);
            let val = array[middle] - target;
            if (val <= deviation && val >= -deviation) {
                return middle;
            }
            if (val > deviation) {
                end = middle;
            }
            if (val < -deviation) {
                start = middle;
            }
        }
        let val = array[start] - target;
        if (Math.abs(array[start] - target) <= deviation) {
            return start;
        }
        if (Math.abs(array[end] - target) <= deviation) {
            return end;
        }

        if (start === end && val < deviation && val > -deviation) {
            return start;
        }
        if (start === end && val > deviation) {
            return -1;
        }
        if (start === end && val < -deviation) {
            return -1;
        }
        return -1;
    }

    //移动音量条的函数
    vAdjust(event) {

        let Y = this.volumeHeight - event.clientY + this.$volumeProgress.offset().top;

        let percent = Y / this.volumeHeight;

        this.play.volume = percent;
    }
    //设置界面上的歌词容器里的歌词
    setLyric(lyric, $ct) {
        if (!Array.isArray(lyric)) {
            throw new Error("lyric is not a Array");
        }
        if (!$ct) {
            throw new Error("two arguments are request");
        }
        let html = "";
        if (lyric.length > 0) {
            for (let i = 0, len = lyric.length; i < len; i++) {
                html += "<li>" + lyric[i] + "</li>";
            }
        } else {
            html = "<li>抱歉,该歌曲没有歌词~</li>"
        }
        $ct.html(html);
    }

    //歌词方法,返回一个对象,带着两个list,关于歌词的时间
    disposeLyric(ssid, sid) {
        let ly = [];
        let _this=this;
        $.post('http://api.jirengu.com/fm/getLyric.php', {
                ssid: ssid,
                sid: sid
            })
            .done(function(lyric) {
                lyric = $.parseJSON(lyric);
                lyric = lyric.lyric;
                lyric = lyric.match(/\[[^\[]+/g);
                if (lyric) {
                    for (let i = 0, len = lyric.length; i < len; i++) {
                        //设置时间数组
                        let tempTime = lyric[i].match(/\d+/g);
                        if (tempTime.length < 0 || tempTime == null) {
                            throw new Error("tempTime is not exist");
                        };
                        _this.lyTime.push(tempTime[0] * 60 + (+tempTime[1]));
                        //设置歌词数组
                        let tempLy = lyric[i].match(/(?=]).+/g);
                        if (tempLy.length < 0 || tempLy == null) {
                            throw new Error("tempLy is not exist");
                        };
                        tempLy = tempLy[0];
                        ly.push(tempLy.substr(1, tempLy.length - 1));
                    }

                }
            }).done(function() {
                setLyric(ly, _this.$musicLyric);
            });
    }

    //简单获取一首歌词
    setSimpleSong(channel = 0) {
        let song = {};
        let songList=this.songList;
        let _this=this;
        $.get('http://api.jirengu.com/fm/getSong.php', {
                channel: channel
            })
            .done(function(data) {
                data = $.parseJSON(data);
                song = data.song[0];
            }).done(function() {

                _this.setMusicBySong.call(_this,song);
                if (songList.length > _this.songNum) {
                    songList.pop();
                }
                songList.push(song);
            });
    }

    //没有歌曲的错误处理
    showSongListEmptyError(Message) {

        let html = `<div class="music-error">
                  <div class="music-error-message music-center">
                    ${Message}
                  </div>
                </div`;
        let $error = $(html);

        this.$musicContent.append($error);

        $error.fadeOut(3000, () => {
            $error.remove();
        });
    }
    //已经废弃的方法
    showLyricByTime() {
        let times = this.lyTime;
        console.log(times);
        let time = this.play.currentTime;
        console.log(time);
        let index = 0;
        index = this.searchBinary(times, time, 1);
        console.log(index);
        if (index > 0) {

        }
        setTimeout(showLyricByTime, 1000);
    }

    //根据song来设置播放器
    setMusicBySong(song) {
        this.play.src = song.url;
        this.$musicTitle.text(song.title);
        this.$musicLyric.css({
            backgroundImage: "url(" + song.picture + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
        });
    }
    //1获取专辑分类
    setChannels(channels, $ct) {
        if (!$ct) {
            throw new Error("two arguments are request");
        }
        let html = "";
        let i = 0;
        for (let channel of channels) {
            if (i === 0) {
                html += "<li class='music-item item-active' data-channel-id=" + channel.channel_id + ">" + channel.name + "</li>";
                this.currChannel = channel.channel_id;
            } else {
                html += "<li class='music-item' data-channel-id=" + channel.channel_id + ">" + channel.name + "</li>";
            }
            i++;
        }
        $ct.html(html);
    }

    getChannels() {
        let channels;
        let _this=this;
        $.get("http://api.jirengu.com/fm/getChannels.php").done(function(data) {
            data = $.parseJSON(data);
            channels = data.channels;
        }).done(function() {
            _this.setChannels.call(_this,channels, _this.$musicMenu);
        });
    }

    static setDrag($ele,$ct){

        if(!$ct){
          $ct=$ele;
        }
        let $body=$("body");
        let canDrag=false;
        let mInEleX=0;
        let mInEleY=0;
        let minX=0;
        let maxX=$body.width()-$ct.width();
        let minY=0;
        let maxY=$body.height()-$ct.height();
        $ele.on("mousedown",function(event){
            event.stopPropagation();
            canDrag=true;
            let oldX=$ct.offset().left;
            let oldY=$ct.offset().top;
            // mInEleX=event.pageX-$this.position().left;
            // console.log(mInEleX);
            mInEleX=event.pageX-oldX;
            mInEleY=event.pageY-oldY;
            $ct.data({
              'oldX':oldX,
              'oldY':oldY
            });
        });
        $body.on("mouseup mouseleave",function(event){
            event.stopPropagation;
            canDrag=false;
            $ct.data({
              'newX':$ct.offset().left,
              'newY':$ct.offset().top
            });
        });
        $body.on("mousemove",function(event){
            if(!canDrag){return;};
            let cX=event.pageX;
            let cY=event.pageY;
            let left=cX-mInEleX;
            let top=cY-mInEleY;

            if(left<minX){
                left=minX;
            }

            if(left>maxX){
              left=maxX;
            }

            if(top<minY){
              top=minY;
            }

            if(top>maxY){
              top=maxY;
            }
            $ct.css({
              left:left,
              top:top
            });
        });

    }

    bindEvent(){
      let _this=this;
      let $play=this.$play;
      let play=this.play;
      this.$menuIcon.on("click", function(event){ //展示菜单栏的效果
          event.stopPropagation();
          _this.$musicMenu.animate({
                  left: "0"
              },
              800
          );
      });
      this.$musicMenu.on("mouseleave", function() { //离开时菜单消失的效果
          let $this = $(this);
          let leftX = -$this.width();
          $this.animate({
                  left: leftX
              },
              800
          );
      });
      //设置关于音量的互动效果
      this.$musicVolume.on("mouseenter", () => { //展示音量的效果
          _this.$volumeProgress.css({
              display: "block"
          });
      });
      this.$musicVolume.on("mouseleave", () => { //使得音量的进度条消失
          _this.$volumeProgress.css({
              display: "none"
          });
      });
      //中间播放图标点击播放的效果
      this.$musicIcon.on("click", function(event) { //如果把状态变量放置在元素上，会导致点击两次才OK
          event.stopPropagation();
          if (_this.state) {
              play.pause();
          } else {
              play.play();
          }
      });
      //菜单点击切换播放音乐的效果
      this.$musicMenu.on("click", ".music-item", function() {//点击变换歌曲的作用
          if(_this.barLinking){return;};
          _this.barLinking=true;
          let $this = $(this);
          _this.currChannel = $this.attr("data-channel-id");
          // let itemSrc=$this.attr("data-source");//获得要切换的歌词的URL地址
          //开始改变了歌曲资源
          play.pause();
          _this.setSimpleSong.call(_this,_this.currChannel);
          $this.siblings().removeClass("item-active");
          $this.addClass("item-active");
      });
      //点击进度条，改变播放进度的效果
      this.$musicProgress.on("click", function(event) {
          event.stopPropagation();

          let $this = $(this);
          let X = event.clientX - $this.offset().left;

          let percent = X / _this.musicWidth;
          let time = _this.play.duration * percent;

          _this.MprogressChange.call(_this,percent);
          _this.play.currentTime = time;
      });

      //点击调整音量的功能
      this.$volumeProgress.on("click", function(event) {
          event.stopPropagation();
          if (_this.volumeDrag) {
              return;
          };
          _this.vAdjust.call(_this,event);
      });
      //鼠标移动调整进度条的功能
      this.$volumeProgress.on("mouseover", function(event) {
          event.stopPropagation();
          if (!_this.volumeDrag) {
              return;
          }
          _this.vAdjust.call(_this,event);
      });
      this.$volumeProgress.on("mouseleave mouseup", () => {
          _this.volumeDrag = false;
      });
      //通过是否点了调整的标志来修改事件
      this.$volumeTag.on("mousedown", function(event) {
          event.stopPropagation();
          _this.volumeDrag = true;
      });

      this.$volumeIcon.on("click", function() {
          event.stopPropagation();
          play.muted = !play.muted;
      });
      this.$musicNext.on("click", () => {
          _this.setSimpleSong.call(_this,_this.currChannel);
      });
      this.$musicPre.on("click", function() {
          let songList=_this.songList;
          if (songList.length === 0) {
              _this.showSongListEmptyError.call(_this,_this.errorMessage);
          } else {
              _this.setMusicBySong.call(_this,songList.pop());
          }
      });
      $play.on("ended", () => {
          if(play.loop){return;};
          _this.setSimpleSong.call(_this,_this.currChannel);
      });
      //音乐暂停时修改状态变量和修改图标;
      $play.on("pause", () => {
          _this.$musicIcon.removeClass("fa-pause");
          _this.$musicIcon.addClass("fa-play");
          _this.$musicLyric.css("animationPlayState","paused");
          _this.state = false;
      });
      $play.on("play", function(){
          _this.$musicIcon.removeClass("fa-play");
          _this.$musicIcon.addClass("fa-pause");
          _this.$musicLyric.css("animationPlayState","running");
          _this.state = true;
      });
      $play.on("timeupdate", function() {
          let start = this.currentTime;
          let end = this.duration;
          _this.$currtime.text(_this.timeFormat(start));
          _this.MprogressChange.call(_this,start / end);
      });
      $play.on("canplay", function() {
          let end = _this.timeFormat(this.duration);
          let start = _this.timeFormat(0);
          //设置进度的时间
          _this.$currtime.text(start);
          _this.$endtime.text(end);

          //初始化进度条
          _this.MprogressChange.call(_this,0);
          //自动播放
          play.play();

          _this.barLinking=false;
          //渲染歌词
          // disposeLyric(song.ssid,song.sid);
      });

      $play.on("volumechange", function() {
          let vol = this.volume;
          let $volumeIcon=_this.$volumeIcon;
          _this.vProgressChange.call(_this,vol);
          if (this.muted || vol < 0.1) {
              if ($volumeIcon.hasClass("fa-volume-off")) {
                  return;
              };
              $volumeIcon.removeClass("fa-volume-up");
              $volumeIcon.addClass("fa-volume-off");
          } else {
              if ($volumeIcon.hasClass("fa-volume-up")) {
                  return;
              };
              $volumeIcon.removeClass("fa-volume-off");
              $volumeIcon.addClass("fa-volume-up");
          }
      });

      this.$musicTag.on("click",function(event){
          event.stopPropagation();
          if(_this.animating){return;};
          let oldX=_this.$musicPlay.data("oldX");
          let oldY=_this.$musicPlay.data("oldY");
          let newX=_this.$musicPlay.data("newX");
          let newY=_this.$musicPlay.data("newY");
          if(!(oldX-newX===0&&oldY-newY===0)){
            return;
          }
          _this.animating=true;
          _this.$musicContent.slideToggle(2000,function(){
            _this.animating=false;
          });
      });

      this.$musicContent.on("mousedown",function(event){
          event.stopPropagation();
      });
    }
}
