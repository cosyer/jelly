(function() {
    var WIDTH = document.body.clientWidth - 20;
    console.log(WIDTH);
    var HEIGHT = document.body.clientHeight - 20;
    console.log(HEIGHT);
    var RADIUS = Math.round(WIDTH / 5 * 4 / 108) - 1;
    var CELLBW = RADIUS + 1;
    var MARGIN_TOP = Math.round(HEIGHT / 10);
    var MARGIN_LEFT = Math.round(WIDTH / 10);
    var NUMCOUNT = 7;
    var COLON = 4;
    var currTime = new Date();

    var balls = [];

    var colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    canvas.height = HEIGHT;
    canvas.width = WIDTH;

    function renderDigit(x, y, num, ctx) {
        ctx.fillStyle = "rgb(0,102,153)";
        for (var i = 0; i < digit[num].length; i++) {
            for (var j = 0; j < digit[num][i].length; j++) {
                if (digit[num][i][j] == 1) {
                    ctx.beginPath();
                    ctx.arc(x + j * 2 * CELLBW + CELLBW, y + i * 2 * CELLBW + CELLBW, RADIUS, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
    }

    function getHMS(date) {
        var H = date.getHours();
        var M = date.getMinutes();
        var S = date.getSeconds();
        H = H < 10 ? "0" + H : H;
        M = M < 10 ? "0" + M : M;
        S = S < 10 ? "0" + S : S;
        return H + ":" + M + ":" + S;
    }

    function renderTime(date, ctx) { //这只是视图层并没有更新数据，单一职责
        date = date || new Date();
        date = getHMS(date);
        var left = MARGIN_LEFT;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (var i = 0; i < date.length; i++) {
            if (date.charAt(i) === ":") {
                renderDigit(left, MARGIN_TOP, 10, ctx);
                left = left + 2 * CELLBW * COLON + CELLBW;
            } else {
                renderDigit(left, MARGIN_TOP, +date.charAt(i), ctx);
                left = left + 2 * CELLBW * NUMCOUNT + CELLBW;
            }
        }

    }

    function updateBallsByTime(currTime, nextTime) {
        var now = getHMS(currTime);
        var next = getHMS(nextTime);
        var left = MARGIN_LEFT;
        for (var i = 0; i < now.length; i++) {
            if (now.charAt(i) === ":") {
                left = left + 2 * CELLBW * COLON + CELLBW;
                continue;
            }
            if (now.charAt(i) !== next.charAt(i)) {
                addBalls(left, MARGIN_TOP, +now.charAt(i));
            }
            left = left + 2 * CELLBW * NUMCOUNT + CELLBW;
        }
    }

    function updateBalls() {

        for (var i = 0; i < balls.length; i++) {
            balls[i].x += balls[i].vx;
            balls[i].y += balls[i].vy;
            balls[i].vy += balls[i].g;
            if (balls[i].y >= HEIGHT - RADIUS) {
                balls[i].y = HEIGHT - RADIUS;
                balls[i].vy = -balls[i].vy * 0.75;
                if (balls[i].vy < 1 && balls[i].vy > -1) {
                    balls[i].vy = 0;
                }
            }
        }
        var cnt = 0
        for (var i = 0; i < balls.length; i++) {
            if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WIDTH)
                balls[cnt++] = balls[i];
        }
        while (balls.length > cnt) {
            balls.pop();
        }
    }

    function addBalls(x, y, num) {
        for (var i = 0; i < digit[num].length; i++) {
            for (var j = 0; j < digit[num][i].length; j++) {
                if (digit[num][i][j] === 1) {
                    var ball = {
                        x: x + j * 2 * CELLBW + CELLBW,
                        y: y + i * 2 * CELLBW + CELLBW,
                        r: RADIUS,
                        vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 2,
                        vy: -3,
                        g: 1.5 + Math.random(),
                        color: colors[Math.floor(Math.random() * colors.length)]
                    }
                    balls.push(ball);
                }
            }
        }
    }

    function renderBalls(ctx) {

        for (var i = 0; i < balls.length; i++) {
            ctx.beginPath();
            var ball = balls[i];
            ctx.fillStyle = ball.color;
            ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }

    }
    requestAnimationFrame(function render() {
        renderTime(currTime, ctx);
        renderBalls(ctx);
        var nextTime = new Date();
        if (nextTime - currTime > 1000) {
            updateBallsByTime(currTime, nextTime);
            currTime = nextTime;
        }
        updateBalls();
        requestAnimationFrame(render);
    });
})();
