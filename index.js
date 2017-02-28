var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var base = [[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]];

app.use(express.static(path.join(__dirname, '/pub')));

app.get('/', function(req, res){
  res.sendFile('/index.html');
});

app.get('/data/:id', function(req, res){
  res.sendFile('/data.html', { root: path.join(__dirname, '/pub') });
});


io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('load', base);
  socket.on('time', function(msg){
  console.log(msg);
  base[msg[0]-1][1] = msg[1];
  base[msg[0]-1][0] = 1
  });
  socket.on('disconnect', function(){
  console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
