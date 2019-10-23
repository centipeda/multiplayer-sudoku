var socket = io();
$("#newgame").click(new_game_but);
$("#joingame").click(join_game_but);
$("#gameid").toggle();

function create_player_data() {
  var player = { "x": 1,
                 "y": 1,
                 "tentativeNum": "0",
                 "color":'#'+Math.floor(Math.random()*16777215).toString(16)
  };
  var id = Math.round(Math.random() * 10000).toString();
  player["id"] = id;
  sessionStorage.setItem("playerId", id);
  return player;
};

function new_game_but() {
    $("#newgame").off();
    $("#newgame").click(start_game_but);
    console.log("new game creating");
    socket.emit("newgame", create_player_data());
};

function start_game_but() {
    window.location.href = "board.html";
};

function join_game_but() {
    $("#joingame").off();
    $("#joingame").html("Join Game");
    $("#gameid").toggle();
    $("#joingame").click(function() {
      var input = $("#gameid").val();
      if(input.length === 4 && !isNaN(input)) {
        socket.emit("joingame", [create_player_data(), input]);
      } else {
        $("#add-info").html("Invalid game ID!");
        console.log("Invalid game ID!");
      }
    })
}

socket.on("start game", function(data) {
  $("#info").html("Your game id is: " + data["id"]);
  $("#newgame").html("Join Game");
  console.log("received data");
  console.log(data);
  sessionStorage.setItem("gameData", JSON.stringify(data));
  console.log("retrieving stored data");
  console.log(sessionStorage.getItem("gameData"));
});

socket.on("join game", function(data) {
  window.location.href = "board.html";
  sessionStorage.setItem("gameData", JSON.stringify(data));
});