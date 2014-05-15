
var net = require('net');
var html = require('fs').readFileSync('C:/Users/ok/Documents/GitHub/Joystick-Web/html/index.html');
var app = require('http').createServer(function(req, res){ res.end(html); });
app.listen(4040);

var HOST = '127.0.0.1';
var PORT = 4040;

var PORT_ANTHONY = 6969;

var client = new net.Socket();

client.connect(PORT_ANTHONY, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT_ANTHONY);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write('Client connected !');

});


var server = net.createServer();
server.listen(PORT, HOST);
console.log('Server listening on ' + server.address().address +':'+ server.address().port);
server.on('connection', function(sock) {
    
    console.log(data);
	client.write(data+"\n");
    
});
