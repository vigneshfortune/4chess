var e    = require('express');

var http = require('http');
const PORT = process.env.PORT || 3000;
var app = e();
var server = http.createServer( app );
const sio = require("socket.io")(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "https://master.d2dktscasgyu0l.amplifyapp.com/",
		"Access-Control-Allow-Methods":"OPTIONS, GET",
		"Access-Control-Request-Method":"*",

            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});
var io  = sio.listen(server);

var player = 0;
var playerids = [];
var login = new Array(4);
turn = 0;

io.sockets.on('connection', function(socket) {
  socket.on('new message', function(msg) {
    io.sockets.emit('new message', msg );
	if(turn == 4){turn = 1;}
	else{turn++;}
	io.sockets.emit('turn', turn );
  });
  socket.on('findmatch', function(msg) {
	if(!playerids.includes(socket.id))
	{
	console.log("ID: " + socket.id + " Seraching for a match");
	playerids.push(socket.id);
	player++;
	console.log("Player " + player + " connected.")
	
	if(player < 5)
	{
		io.sockets.emit( 'player', player );
		login[player-1] = 1;
	}
	else
	{
		io.sockets.emit( 'player', "max");
	}
	}
	if(login[3] == 1 && turn == 0){turn = 1; io.sockets.emit('turn', turn );}
    
  });
});

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));