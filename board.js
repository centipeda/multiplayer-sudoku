var socket = io();

var can = $("#board").get(0);
var ctx = can.getContext("2d");
ctx.lineWidth = 2;

var gameData = JSON.parse(sessionStorage.getItem("gameData"));
var id = sessionStorage.getItem("playerId");

var frame = 0;

// game funcs
function verify_tentative() {
    var tx = gameData["players"][id]["x"];
    var ty = gameData["players"][id]["y"];
    var target = gameData["solution"][ty - 1][tx - 1];
    var current = gameData["board"][ty - 1][tx - 1];
    if(current != "X") {
        return;
    } else if(gameData["players"][id]["tentativeNum"] === target) {
        console.log("Correct!");
        gameData["board"][ty - 1][tx - 1] = gameData["players"][id]["tentativeNum"];
    } else {
        console.log("Incorrect!");
    }
}

function clear_board(ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, can.width, can.height);
}

function draw_board(ctx) {
    for(c = 0; c < 8; c++) {
    ctx.beginPath();
    if(c == 2 || c == 5) { ctx.lineWidth = 5; }
    var p = 56 + (56 * c);
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 504);
    ctx.stroke();
    ctx.lineWidth = 2;

    }
    for(c = 0; c < 8; c++) {
        ctx.beginPath();
        var p = 56 + (56 * c);
        if(c == 2 || c == 5) { ctx.lineWidth = 5; }
        ctx.moveTo(0, p);
        ctx.lineTo(504, p);
        ctx.stroke();
        ctx.lineWidth = 2;
    }
}

function draw_n(ctx, x, y, n) {
    if(n === "X") {
        return;
    }
    ctx.font = "58px Tahoma";
    fx = ((y - 1) * 56) + 11;
    fy = ((x-1) * 56) + 49;
    ctx.fillText(n, fx, fy);
}

function draw_game(ctx, board) {
    // assumes two-layered array with each subarray representing a row
    ctx.fillStyle = "#000000";
    for(x = 1; x < 10; x++) {
        for(y = 1; y < 10; y++) {
            draw_n(ctx, x, y, board[x - 1][y - 1]);
        }
    }
}

function draw_cursor(ctx, x, y, col) {
    fx = (x - 1) * 56;
    fy = (y - 1) * 56;
    ctx.fillStyle = col;
    ctx.fillRect(fx, fy, 56, 56);
}

function draw_tentative(ctx, n, board, x, y) {
    if(n === "0") {
        return;
    } else  if (board[y - 1][x - 1] === "X") {
        ctx.fillStyle = "#7A7F87";
    } else {
        return;
    }
    draw_n(ctx, y, x, n);
    ctx.fillStyle = "#000000";
}

// initial conditions
draw_board(ctx);
draw_game(ctx, gameData["board"]);
draw_cursor(ctx, gameData["players"][id]["x"], gameData["players"][id]["y"])
$("#info").html("Game ID: " + gameData["id"]);

$("#board").click(function(event) {
    var rect = can.getBoundingClientRect();
    var mx = Math.floor(Math.floor(event.pageX - rect.left) / 56) + 1;
    var my = Math.floor(Math.floor(event.pageY - rect.top - 65) / 56) + 1;
    console.log("mx " + mx);
    console.log("my " + my);
    gameData["players"][id]["x"] = mx;
    gameData["players"][id]["y"] = my;
});

// input checking
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 68: // D
        if(gameData["players"][id]["x"] < 9) {
            gameData["players"][id]["x"] += 1;
        }
        break;
    case 83: // S
        if(gameData["players"][id]["y"] < 9) {
            gameData["players"][id]["y"] += 1;
        }
        break;
    case 65: // A
        if(gameData["players"][id]["x"]  > 1) {
            gameData["players"][id]["x"] -= 1;
        }
        break;
    case 87: // W
        if(gameData["players"][id]["y"] > 1) {
            gameData["players"][id]["y"] -= 1;
        }
        break;
    case 48: // 0
        gameData["players"][id]["tentativeNum"] = "0";
        break;
    case 49: // 1
        gameData["players"][id]["tentativeNum"] = "1";
        break;
    case 50: // 2
        gameData["players"][id]["tentativeNum"] = "2";
        break;
    case 51: // 3
        gameData["players"][id]["tentativeNum"] = "3";
        break;
    case 52: // 4
        gameData["players"][id]["tentativeNum"] = "4";
        break;
    case 53: // 5
        gameData["players"][id]["tentativeNum"] = "5";
        break;
    case 54: // 6
        gameData["players"][id]["tentativeNum"] = "6";
        break;
    case 55: // 7
        gameData["players"][id]["tentativeNum"] = "7";
        break;
    case 56: // 8
        gameData["players"][id]["tentativeNum"] = "8";
        break;
    case 57: // 9
        gameData["players"][id]["tentativeNum"] = "9";
        break;
    case 13: // Enter
        verify_tentative();
  }
});

// update client game state as server sends out
socket.on("update", function(data) {
    gameData = data;
});

// send game state to server
setInterval(
    function() {
        socket.emit("state", gameData);
    }, 1000 / 30);

// update loop
setInterval(
    function() {
        // game logic
        // drawing
        clear_board(ctx);
        for(x in gameData["players"]) {
            var p = gameData["players"][x];
            draw_cursor(ctx, p["x"], p["y"], p["color"]);
            draw_tentative(ctx, p["tentativeNum"], gameData["board"], p["x"], p["y"]);
        }
        draw_board(ctx);
        draw_game(ctx, gameData["board"]);
        if(frame === 60) {
            frame = 0;
        } else {
            frame++;
        }
    }, 1000 / 30);

