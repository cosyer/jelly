"use strict";

let $play = $("#player"); //这是真实的播放器,jq版本
let play = $play[0]; //还原成原生的元素
let $musicPlay = $(".music-play"); //获得假的播放器的整体

let $musicContent = $musicPlay.find(".music-content");
let $menuIcon = $musicPlay.find(".music-menu-icon"); //菜单标记
let $musicMenu = $musicPlay.find(".music-menu"); //真实的菜单栏

let $currtime = $musicPlay.find(".music-time-currtime"); //获得播放开始的时间
let $endtime = $musicPlay.find(".music-time-endtime"); //获得播放结束的时间

let $musicProgress = $musicPlay.find(".music-progress"); //获得总播放的进度条
let $progressStart = $musicProgress.find(".music-progress-start"); //获得已经播放的进度条
let $progressEnd = $musicProgress.find(".music-progress-end"); //获得未播放的进度条

let $musicVolume = $musicPlay.find(".music-volume"); //获得音量这边区域的元素
let $volumeIcon = $musicVolume.find(".j-volume-icon"); //获得音量的图标
let $volumeProgress = $musicVolume.find(".music-volume-progress"); //获得音量进度条区域
let $volumeStart = $musicVolume.find(".music-volume-time-start"); //获得当前音量
let $volumeEnd = $musicVolume.find(".music-volume-time-end"); //获得剩余音量
let $volumeTag = $musicVolume.find(".music-volume-tag"); //获得调节音量的标志

//获得剩余需要操作的DOM
let $musicIcon = $musicPlay.find(".j-music-icon"); //获得播放或者暂停的图标
let $musicPre = $musicPlay.find(".music-pre"); //上一曲
let $musicNext = $musicPlay.find(".music-next"); //下一曲

//获得要操作的歌词和标题
let $musicTitle = $musicPlay.find(".music-title");
let $musicLyric = $musicPlay.find(".music-lyric");

//设置一些状态变量
let state = false; //false表示状态未播放
let volumeDrag = false; //false表示不需要拖动音量标签


let songList = []; //音乐列表
let lyTime = []



let noLyric = "此曲目为纯音乐";
let currChannel = "0";

//获得一些需要知道的固定量
const musicWidth = $musicProgress.width(); //200px 注意这边进度条还有1px的左右border
const volumeHeight = $volumeProgress.height(); //100px
const volumeTagH = $volumeTag.height();
const songNum = 3; //最大缓存歌曲数量
const errorMessage = "没有更多的歌曲了~";

//定义一些类内部使用的工具方法
//格式化时间
function timeFormat(time) {
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
function MprogressChange(percent) {

    if (percent < 0 || percent > 1) {
        throw new Error("illegal arguments about percent");
    }

    let start = percent * musicWidth;
    let end = musicWidth - start;

    $progressStart.width(start);
    $progressEnd.width(end);
}
//根据百分比调整音量进度条
function vProgressChange(percent) {

    if (percent < 0 || percent > 1) {
        throw new Error("illegal arguments about percent");
    }

    let start = percent * (volumeHeight - volumeTagH);
    let end = volumeHeight - volumeTagH - start;

    $volumeStart.height(start);
    $volumeEnd.height(end);

}
//逐次逼近，二分搜索,工具方法，迭代做的
// function searchBinary(array, target, deviation = 0, start = 0, end = array.length - 1) {
//     //找到就返回索引值,没找到就是-1(gg)
//     while (end - start > 1) {
//         let middle = Math.ceil((start + end) / 2);
//         let val = array[middle] - target;
//         if (val <= deviation && val >= -deviation) {
//             return middle;
//         }
//         if (val > deviation) {
//             end = middle;
//         }
//         if (val < -deviation) {
//             start = middle;
//         }
//     }
//     let val = array[start] - target;
//     if (Math.abs(array[start] - target) <= deviation) {
//         return start;
//     }
//     if (Math.abs(array[end] - target) <= deviation) {
//         return end;
//     }
//
//     if (start === end && val < deviation && val > -deviation) {
//         return start;
//     }
//     if (start === end && val > deviation) {
//         return -1;
//     }
//     if (start === end && val < -deviation) {
//         return -1;
//     }
//     return -1;
// }
//移动音量条的函数
function vAdjust(event) {

    let Y = volumeHeight - event.clientY + $volumeProgress.offset().top;

    let percent = Y / volumeHeight;

    play.volume = percent;
};
//设置界面上的歌词容器里的歌词
function setLyric(lyric, $ct) {
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
};
//歌词方法,返回一个对象,带着两个list,关于歌词的时间
function disposeLyric(ssid, sid) {
    let ly = [];
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
                    lyTime.push(tempTime[0] * 60 + (+tempTime[1]));
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
            setLyric(ly, $musicLyric);
            //开始处理歌词
            // showLyricByTime();

        });
}

//简单获取一首歌词
function setSimpleSong(channel) {
    let song = {};
    $.get('http://api.jirengu.com/fm/getSong.php', {
            channel: channel
        })
        .done(function(data) {
            data = $.parseJSON(data);
            song = data.song[0];
        }).done(function() {

            setMusicBySong(song);
            if (songList.length > songNum) {
                songList.pop();
            }
            songList.push(song);
        });
}
//没有歌曲的错误处理
function showSongListEmptyError(Message) {

    let html = `<div class="music-error">
              <div class="music-error-message music-center">
                ${Message}
              </div>
            </div`;
    let $error = $(html);

    $musicContent.append($error);

    $error.fadeOut(3000, () => {
        $error.remove();
    });
}

function showLyricByTime() {
    let times = lyTime;
    console.log(times);
    let time = play.currentTime;
    console.log(time);
    let index = 0;
    index = searchBinary(times, time, 1);
    console.log(index);
    if (index > 0) {

    }
    setTimeout(showLyricByTime, 1000);
};
//展示歌词的主要方法
// function showLyricByTime(time){
//      let index=searchBinary(lyTime,time,2);
//      if(index>-1){
//         $musicLyric.find("li").hide();
//         $musicLyric.find("li").eq(index).show();
//      }
// }
//根据song来设置播放器
function setMusicBySong(song) {
    play.src = song.url;
    $musicTitle.text(song.title);
    console.log(song);
    $musicLyric.css({
        backgroundImage: "url(" + song.picture + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    });
}
//1获取专辑分类
function getChannels() {
    let channels;
    $.get("http://api.jirengu.com/fm/getChannels.php").done(function(data) {
        data = $.parseJSON(data);
        channels = data.channels;
    }).done(function() {
        setChannels(channels, $musicMenu);
    });
}

function setChannels(channels, $ct) {
    if (!$ct) {
        throw new Error("two arguments are request");
    }
    let html = "";
    let i = 0;
    for (let channel of channels) {
        if (i === 0) {
            html += "<li class='music-item item-active' data-channel-id=" + channel.channel_id + ">" + channel.name + "</li>";
            currChannel = channel.channel_id;
        } else {
            html += "<li class='music-item' data-channel-id=" + channel.channel_id + ">" + channel.name + "</li>";
        }
        i++;
    }
    $ct.html(html);
}
//设置关于菜单的互动特效
$menuIcon.on("mouseenter", () => { //展示菜单栏的效果
    $musicMenu.animate({
            left: "0"
        },
        800
    );
});
$musicMenu.on("mouseleave", function() { //离开时菜单消失的效果
    let $this = $(this);
    let leftX = -$this.width();
    $this.animate({
            left: leftX
        },
        800
    );
});
//设置关于音量的互动效果
$musicVolume.on("mouseenter", () => { //展示音量的效果
    $volumeProgress.css({
        display: "block"
    });
});
$musicVolume.on("mouseleave", () => { //使得音量的进度条消失
    $volumeProgress.css({
        display: "none"
    });
});
//中间播放图标点击播放的效果
$musicIcon.on("click", function(event) { //如果把状态变量放置在元素上，会导致点击两次才OK
    event.stopPropagation();
    if (state) {
        play.pause();
    } else {
        play.play();
    }
});
//菜单点击切换播放音乐的效果
$musicMenu.on("click", ".music-item", function() { //点击变换歌曲的作用
    let $this = $(this);
    currChannel = $this.attr("data-channel-id");
    // let itemSrc=$this.attr("data-source");//获得要切换的歌词的URL地址
    //开始改变了歌曲资源
    play.pause();
    setSimpleSong(currChannel);
    $this.siblings().removeClass("item-active");
    $this.addClass("item-active");
});
//点击进度条，改变播放进度的效果
$musicProgress.on("click", function(event) {
    event.stopPropagation();

    let $this = $(this);
    let X = event.clientX - $this.offset().left;

    let percent = X / musicWidth;
    let time = play.duration * percent;

    MprogressChange(percent);
    play.currentTime = time;
});

//点击调整音量的功能
$volumeProgress.on("click", function(event) {
    event.stopPropagation();
    if (volumeDrag) {
        return;
    };
    vAdjust(event);
});
//鼠标移动调整进度条的功能
$volumeProgress.on("mouseover", function(event) {
    event.stopPropagation();
    if (!volumeDrag) {
        return;
    }
    vAdjust(event);
});
$volumeProgress.on("mouseleave mouseup", () => {
    volumeDrag = false;
});
//通过是否点了调整的标志来修改事件
$volumeTag.on("mousedown", function(event) {
    event.stopPropagation();
    volumeDrag = true;
});
// $volumeTag.on("mouseup",function(event){
//     event.stopPropagation();
//     volumeDrag=false;
// });
$
$volumeIcon.on("click", function() {
    event.stopPropagation();
    play.muted = !play.muted;
});
$musicNext.on("click", () => {
    setSimpleSong(currChannel);
});
$musicPre.on("click", function() {
    if (songList.length === 0) {
        showSongListEmptyError(errorMessage);
    } else {
        setMusicBySong(songList.pop());
    }
});
$play.on("ended", () => {
    setSimpleSong(currChannel);
});
//音乐暂停时修改状态变量和修改图标;
$play.on("pause", () => {
    $musicIcon.removeClass("fa-pause");
    $musicIcon.addClass("fa-play");
    $musicLyric.css("animationPlayState","paused");
    state = false;
});
$play.on("play", () => {
    $musicIcon.removeClass("fa-play");
    $musicIcon.addClass("fa-pause");
    $musicLyric.css("animationPlayState","running");
    state = true;
});
$play.on("timeupdate", function() {
    let start = this.currentTime;
    let end = this.duration;
    $currtime.text(timeFormat(start));
    MprogressChange(start / end);
    // showLyricByTime(this.currentTime);
    // if(lyTime.length>0){
    //   showLyricByTime(start);
    // }
});
$play.on("canplay", function() {
    let end = timeFormat(this.duration);
    let start = timeFormat(0);
    let song = songList[songList.length - 1];
    //设置进度的时间
    $currtime.text(start);
    $endtime.text(end);
    //初始化进度条
    MprogressChange(0);
    //自动播放
    play.play();
    //渲染歌词
    // disposeLyric(song.ssid,song.sid);
});

$play.on("volumechange", function() {
    let vol = this.volume;
    vProgressChange(vol);
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
//前方高能，测试区域
//递归方式实现
//逐次逼近，二分搜索，递归做法
// function searchBinary(array,target,start=0,end=array.length-1,deviation=0){
//     //找到就返回索引值,没找到就是-1(gg)
//     //二分搜索算法
//   let val=array[start]-target;
//   if(start===end && val<=deviation && val>-deviation){
//       return start;
//   }
//   if(start===end && val>deviation){
//     return -1;
//   }
//   if(start===end && val<-deviation){
//     return -1;
//   }
//   if(end<start){
//     return -1;
//   }
//   let middle=Math.ceil((start+end)/2);
//
//   val=array[middle]-target;
//
//   if(val<=deviation && val>=-deviation ){
//       return middle;
//   }
//   if(val>deviation){
//     end=middle;
//   }
//   if(val<-deviation){
//     start=middle;
//   }
//   return searchBinary(array,target,start,end,deviation);
// };
// var array=[1,2,3,4,5];
// console.log(searchBinary(array,2));

getChannels();

setSimpleSong(currChannel);



// disposeLyric("fbbf","252990");//"fbbf" "252990
