//le fichier principal qu'on utilise (pas serveur.js)


var html = require('fs').readFileSync('C:/Users/ok/Documents/GitHub/Joystick-Web/html/index.html');
var app = require('http').createServer(function(req, res){ res.end(html); });
app.listen(4040);
var io = require("socket.io");
var io = io.listen(app);

//TCP
var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6969;

var client = new net.Socket();

client.connect(PORT, HOST, function() {
 
   client.write("Client connected \n");

});

io.sockets.on('connection', function (socket) {
  socket.on('message', function (message) { 
  console.log('C est: '+message); 
  client.write(message+"\n");
  
  
  });
});
