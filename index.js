var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var base = [[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]];

app.use(express.static(path.join(__dirname, '/pub')));
//app.set('view engine', 'ejs');
app.get('/', function(req, res){
  console.log("lolz");
  stringbase = '[';
  console.log(stringbase);
  for(i in base) {
    console.log(base[i].toString());
    stringbase = stringbase + '[' + base[i].toString() + '],';
  };
  stringbase = stringbase + '];';
  res.render('index.ejs', { data: 'var data =', vars: stringbase});
});

app.get('/data/:id', function(req, res){
  stringbase = '[';
  for(i in base) {
    stringbase = stringbase + '[' + base[i].toString() + '],';
  };
  stringbase = stringbase + '];';
  res.render('data.ejs', { data: 'var data =', vars: stringbase});
});

app.get('/input/:id', function(req, res){
  base[req.params.id][0] = 1;
  base[req.params.id][1] = new Date().getTime();
  io.emit('upstart', base);
  res.send("lolz");
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('load', base);
  socket.on('time', function(msg){
  console.log(msg);
  base[msg[0]][1] = msg[1];
  base[msg[0]][0] = 1;
  socket.broadcast.emit('upstart', base);
  });
  socket.on('end', function(msg){
  console.log(msg);
  base[msg[0]][1] = msg[1];
  base[msg[0]][0] = 0;
  socket.broadcast.emit('upend', base);
  });
  socket.on('disconnect', function(){
  console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
