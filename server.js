var express = require("express");
var path = require("path");
var http = require("http");
var socketio = require("socket.io");

var site = express();
var server = http.Server(site);
var io = socketio(server);

site.set('port', 8080);

site.get("/menu", function(req, res) {
  res.sendFile(path.join(__dirname, "menu.html"));
});
site.get("/sudoku", function (req, res) {
  res.sendFile(path.join(__dirname, "sudoku.html"));
});
site.get("/menu.js", function (req, res) {
  res.sendFile(path.join(__dirname, "menu.js"));
});
site.get("/board.html", function (req, res) {
  res.sendFile(path.join(__dirname, "board.html"));
});

site.get("/board.js", function (req, res) {
  res.sendFile(path.join(__dirname, "board.js"));
});
site.get("/sudoku.css", function (req, res) {
  res.sendFile(path.join(__dirname, "sudoku.css"));
});

server.listen(8080, function() {
  console.log('socket on 8080');
});

io.on("connection", function (socket) {

    socket.on("newgame", function(data) {
      games = {};
      sampleGame = [["X", "X", "X", "7", "9", "X", "X", "5", "X"],
                    ["3", "5", "2", "X", "X", "8", "X", "4", "X"],
                    ["X", "X", "X", "X", "X", "X", "X", "8", "X"],
                    ["X", "1", "X", "X", "7", "X", "X", "X", "4"],
                    ["6", "X", "X", "3", "X", "1", "X", "X", "8"],
                    ["9", "X", "X", "X", "8", "X", "X", "1", "X"],
                    ["X", "2", "X", "X", "X", "X", "X", "X", "X"],
                    ["X", "4", "X", "5", "X", "X", "8", "9", "1"],
                    ["X", "8", "X", "X", "3", "7", "X", "X", "X"]];
      sampleSolution = [["8", "6", "1", "7", "9", "4", "3", "5", "2"],
                       ["3", "5", "2", "1", "6", "8", "7", "4", "9"],
                       ["4", "9", "7", "2", "5", "3", "1", "8", "6"],
                       ["2", "1", "8", "9", "7", "5", "6", "3", "4"],
                       ["6", "7", "5", "3", "4", "1", "9", "2", "8"],
                       ["9", "3", "4", "6", "8", "2", "5", "1", "7"],
                       ["5", "2", "6", "8", "1", "9", "4", "7", "3"],
                       ["7", "4", "3", "5", "2", "6", "8", "9", "1"],
                       ["1", "8", "9", "4", "3", "7", "2", "6", "5"]];

        console.log(data);
        var id = generate_game_id();
        newGame = {
            "id": id,
            "board": sampleGame,
            "solution": sampleSolution,
            "players": {}
        };
        newGame["players"][data["id"]] = data;
        games[id] = newGame;
        console.log(newGame);
        io.emit("start game", newGame);
    });

    socket.on("joingame", function(data) {
      console.log(data);
      var playerData = data[0];
      var gameId = data[1];
      games[gameId]["players"][playerData["id"]] = playerData;
      io.emit("join game", games[gameId]);
    });

    socket.on("state", function(data) {
      games[data["id"]] = data;
      io.emit("update", data);
    });
});

function generate_game_id() {
    return Math.round(Math.random() * 10000).toString();
}