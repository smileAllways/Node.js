// 모듈을 추출
var fs = require('fs');

// 서버를 생성
var server = require('http').createServer();
var io = require('socket.io').listen(server);

// 서버를 실행
server.listen(52273, function() {
    console.log('Server Runnig at http://127.0.0.1:52273');
});

// 웹 서버 이벤트를 연결
server.on('request', function (request, response) {
    // HTMLPage.html 파일을 읽음
    fs.readFile('RoomHTMLPage.html', function (error, data) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
    });
});

// 소켓 서버 이벤트를 연결
io.sockets.on('connection', function (socket) {
    // 방 이름을 저장할 변수
    var roomName = null;
    console.log('on');
    
    // join 이벤트
    socket.on('join', function (data) {
        roomName = data;
        socket.join(data);
        console.log('join');
    });
    
    // message 이벤트
    socket.on('message', function (data) {
        console.log('message');
        io.sockets.in(roomName).emit('message', 'test');
    });
});