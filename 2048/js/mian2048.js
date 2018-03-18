var board = new Array();
var score = 0;
var hasConflicted = new Array();
var lock = false;
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

function newgame() {
    //初始化棋盘格
    init();
    updataBoardView();
    //随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function prepareForMobile() {

    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    var $gridContainer = $("#grid-container");
    var $gridCell = $(".grid-cell");
    $gridContainer.css({
        "width": gridContainerWidth - 2 * cellSpace,
        "height": gridContainerWidth - 2 * cellSpace,
        "padding": cellSpace,
        "border-radius": 0.02 * gridContainerWidth
    });
    $gridCell.css({
        "width": cellSideLength,
        "height": cellSideLength,
        "border-radius": 0.02 * gridContainerWidth
    });

}

function init() {

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css({
                'top': getPosTop(i, j),
                'left': getPosLeft(i, j)
            });
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    score = 0;

    $(".gameover").remove();
}

function updataBoardView() {
    $('.number-cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var id = "number-cell-" + i + "-" + j;
            $("#grid-container").append("<div class='number-cell' id=" + id + "></div>");
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] === 0) {

                theNumberCell.css({
                    "width": "0",
                    "height": "0",
                    "top": getPosTop(i, j) + cellSideLength / 2,
                    "left": getPosLeft(i, j) + cellSideLength / 2
                });

            } else {
                theNumberCell.css({
                    "width": cellSideLength,
                    "height": cellSideLength,
                    "top": getPosTop(i, j),
                    "left": getPosLeft(i, j),
                    "backgroundColor": getNumberBackgroundColor(board[i][j]),
                    "color": getNumberColor(board[i][j])
                });

                if (board[i][j] > 1000) {
                    theNumberCell.css({
                        "line-height": cellSideLength + "px",
                        "font-size": 0.4 * cellSideLength + "px"
                    });
                } else {
                    theNumberCell.css({
                        "line-height": cellSideLength + "px",
                        "font-size": 0.6 * cellSideLength + "px"
                    });
                }
                theNumberCell.text(board[i][j]);
            }


            hasConflicted[i][j] = false;

        }
    }
    lock = false;
}

function generateOneNumber() {

    if (nospace(board)) {
        return false;
    }
    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while (times < 50) {
        if (board[randx][randy] === 0) {
            break;
        }

        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));

        times++;
    }

    if (times === 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    randx = i;
                    randy = j;
                    j = 4;
                    i = 4;
                }
            }
        }
    }
    //随机一个数字
    var randNumber = Math.random() > 0.5 ? 2 : 4;
    //在随机位置显示随机字符
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;

}

function isGameOver() {
    if (nospace(board) && nomove(board)) {
        showGameOver();
    }
}

function showGameOver() {
    var $message = $("<div class='gameover'><div class='gameover-message'><p>胜败乃兵家常事，</p><p>少侠请重新来过~</p></div></div>");
    $("#grid-container").append($message);
}

function nospace(board) {

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    //moveLeft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        break;
                    }
                }
            }
        }

    }
    setTimeout(function() {
        updataBoardView();
        generateOneNumber();
    }, 250);
    return true;
}

function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }

    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {

            if (board[i][j] !== 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] === 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;

                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        break;
                    }
                }
            }

        }
    }
    setTimeout(function() {
        updataBoardView();
        generateOneNumber();
    }, 250);
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {

            if (board[i][j] !== 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] === 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;

                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        break;
                    }
                }
            }

        }
    }
    setTimeout(function() {
        updataBoardView();
        generateOneNumber();
    }, 250);
    return true;
}

function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }

    for (var i = 2; i >= 0; i--) {
        for (var j = 0; j < 4; j++) {

            if (board[i][j] !== 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] === 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;

                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        break;
                    }
                }
            }

        }
    }
    setTimeout(function() {
        updataBoardView();
        generateOneNumber();
    }, 250);
    return true;
}

$(document).ready(function() {
    prepareForMobile();
    newgame();
});

$(document).on("keyup", function(event) {
    event.preventDefault();
    // if (lock) {
    //     return;
    // }
    var code = event.keyCode;
    lock = true;
    switch (code) {
        case 37:
            if (moveLeft()) {
                setTimeout(isGameOver, 300);
            }
            break;
        case 38:
            if (moveUp()) {
                setTimeout(isGameOver, 300);
            }
            break;
        case 39:
            if (moveRight()) {
                setTimeout(isGameOver, 300);
            }
            break;
        case 40:
            if (moveDown()) {
                setTimeout(isGameOver, 300);
            }
            break;
        default:
            break;

    }
});
$(document).on("keydown", function() {
    event.preventDefault();
});
document.addEventListener("touchstart", function(event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;

});
document.addEventListener("touchend", function(event) {
    // if (lock) {
    //     return;
    // }
    lock = true;
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltaX = endx - startx;
    var deltaY = endy - starty;
    if (Math.abs(deltaX) < 0.1 * documentWidth && Math.abs(deltaY) < 0.1 * documentWidth) {
        return;
    }

    if (Math.abs(deltaX) >= Math.abs(deltaY)) {

        if (deltaX > 0) {
            //move right
            if (moveRight()) {
                setTimeout(isGameOver, 300);
            }
        } else {
            //move left
            if (moveLeft()) {
                setTimeout(isGameOver, 300);
            }
        }


    } else {

        if (deltaY > 0) {
            //move down
            if (moveDown()) {
                setTimeout(isGameOver, 300);
            }

        } else {
            //move up
            if (moveUp()) {
                setTimeout(isGameOver, 300);
            }
        }

    }
});
document.addEventListener("touchmove", function(event) {
    event.preventDefault();

});
