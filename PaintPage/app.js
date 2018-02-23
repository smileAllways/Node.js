// 모듈을 추출
var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var ejs = require('ejs');
var fs = require('fs');

// 웹 서버를 생성
var app = express();
app.use(express.static('public'));

// 웹 서버를 실행
var server = http.createServer(app);
server.listen(52273, function () {
    console.log('server running at http://127.0.0.1:52273');
});

// 라우트를 수행
app.get('/', function (request, response) {
    fs.readFile('Lobby.html', function (error, data) {
        response.send(data.toString());
    });
});

app.get('/canvas/:room', function (request, response) {
    fs.readFile('Canvas.html', 'utf8', function (error, data) {
        response.send(ejs.render(data, {
            room: request.params.room
        }));
    });
});

app.get('/room', function (request, response) {
    var rooms = Object.keys(io.sockets.adapter.rooms).filter(function (item) {
        return item.indexOf('/') < 0;
    });
    response.send(rooms);
});

// 소켓 서버를 생성
var io = socketio.listen(server);
io.sockets.on('connection', function (socket) {
    var roomId = "";
    
    socket.on('join', function (data) {
        socket.join(data);
        roomId = data;
    });
    
    socket.on('draw', function (data) {
        io.sockets.in(roomId).emit('line', data);
    });
    
    socket.on('creat_room', function (data) {
        io.sockets.emit('create_room', data.toString());
    });
});