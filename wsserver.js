const PORT = process.env.PORT || 3001;
const app = require("express")();
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
	cors: {
	  origin: "https://main.d1kwkw2b6buf0t.amplifyapp.com",
	  methods: ["GET", "POST"],
	  allowedHeaders: ["my-custom-header"],
	  credentials: true
	}
  });

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

  socket.on('countercount', function(msg,figureColorIndex) {

	io.sockets.emit( 'counter', msg,figureColorIndex);
	console.log("counter " + msg + " counter"+figureColorIndex)

});
 
socket.on('movecells', function(value,newValue) {

	io.sockets.emit( 'movedcell', value,newValue);
	console.log("value " + value + newValue )

});
socket.on('indexFigure', function(indexvalue,indexfigue) {

	io.sockets.emit( 'indexedFigure', indexvalue,indexfigue);
	console.log("indexedFigure " + indexvalue + indexfigue );

});

});

httpServer.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));