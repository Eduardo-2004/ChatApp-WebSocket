const express = require("express");
const app = express();

app.use(express.static("public"));

const http = require("http").Server(app);

const serverSocket = require("socket.io")(http);

const porta = 8000;

http.listen(porta, () => {
  console.log(
    "Servidor iniciado na porta: " + porta
  );
});

app.get("/", (req, res) =>
   res.sendFile(__dirname + '/index.html')
);

serverSocket.on('connection', (socket) => {

    socket.on('login', function(nickname){
        console.log('Cliente conectado: ' + nickname);
        serverSocket.emit('chat msg', `Usuário ${nickname} conectou.`);
        socket.nickname = nickname
    })

    socket.on('chat msg', function(msg){
        console.log(`Msg recebida do cliente ${socket.nickname}: ${msg}`);
        serverSocket.emit('chat msg', `${socket.nickname}: ${msg}`);
    })

    socket.on('status', (msg) => {
      socket.broadcast.emit('status', msg)
  })
});


