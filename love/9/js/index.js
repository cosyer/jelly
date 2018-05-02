function delay(time, cb) {
    setTimeout(function () {
        cb();
    }, time);
}
$('.wp-inner').fullpage({
    start: 0,
    change: function (e) {
        // 移除动画属性
        $('.page').eq(e.cur).find('.js-animate').each(function() {
            $(this).removeClass($(this).data('animate')).hide();
        });
    },
    afterChange: function (e) {
        // 添加动画属性
        $('.page').eq(e.cur).find('.js-animate').each(function () {
            var $this = $(this);
            var time = $this.data('time');
            delay(time, function () {
                $this.addClass($this.data('animate')).show();
            });
        });
    }
});

$('#mail').on('click', function () {
    $(this).addClass('open');
    $('#mail-text').show();
});

var bgAudio = new Audio();
bgAudio.loadStatus = 'unload';
bgAudio.loop = true;
function loadAudio(audio, url, callback) {
    audio.src = url;
    audio.load();
    audio.addEventListener('canplay', function () {
        bgAudio.loadStatus = 'loaded';
        callback();
    });
    audio.addEventListener('loadstart', function () {
        bgAudio.loadStatus = 'loading';
    });
}
function playAudio(){
    if (bgAudio.loadStatus === 'unload') {
        loadAudio(bgAudio, 'media/bg1.mp3', function () {
            playAudio();
        });
        return 1;
    }

    bgAudio.play();
}
function stopAudio() {
    bgAudio.pause();
}
bgAudio.addEventListener('playing' ,function (e) {
    $('#music .music-btn').addClass('play');
});
bgAudio.addEventListener('pause' ,function (e) {
    $('#music .music-btn').removeClass('play');
});

$('body').one('touchstart', function () {
    playAudio();
    $('#music').on('touchstart', function (e) {
        if (bgAudio.paused) {
            playAudio();
            return 0;
        }
        stopAudio();
        return 1;
    });
});
window.onload = function() {
    $('#loading').hide();
    if (bgAudio.loadStatus !== 'unload') {return;}
    playAudio();
};

function initTime() {
    var start = new Date(1462118400000);

    function loop() {
        var cur = new Date;

        var y = cur.getFullYear() - start.getFullYear();
        var m = cur.getMonth() - start.getMonth();
        if (m < 0) {
            m = m + 12;
            y = y - 1;
        }

        var d = cur.getDate() - start.getDate();
        if (d < 0) {
            d = d + 30;
            m = m - 1;
        }
        if (m < 0) {
            m = m + 12;
            y = y - 1;
        }

        var subSec = Math.floor((cur.getTime() - start.getTime()) / 1000);

        subSec = subSec % 86400;
        var h = Math.floor(subSec / 3600);
        subSec = subSec % 3600;
        var min = Math.floor(subSec / 60);
        var s = subSec % 60;

        if (h < 10) {
            h = '0' + h;
        }
        if (min < 10) {
            min = '0' + min;
        }
        if (s < 10) {
            s = '0' + s;
        }

        document.querySelector('#ymd').innerHTML = y + '年 ' + m + '月 ' + d + '天';
        document.querySelector('#hms').innerHTML = h + '时 ' + min + '分 ' + s + '秒 ';
        setTimeout(loop, 1000);
    }

    loop();
}

initTime();
