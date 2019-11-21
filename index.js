//librerias
const express = require('express');
const path = require("path");
const SocketIo = require('socket.io');

//configuraciones

const app = express();

app.set('port',process.env.PORT || 3000);

app.use(express.static(path.join(__dirname,"public")));

//iniciando servidor
const server = app.listen(app.get('port'),()=>{

    console.log("servidor en el puerto",app.get('port'));

});


const io = SocketIo.listen(server);

var line_history = [];

io.on('connection',(socket)=>{

    console.log("Conexion entrante: "+socket.handshake.address);

    for(let i in line_history){

        socket.emit('dibujando',{line: line_history[i]});

    }
    
    socket.on('dibujando',function(data){

        line_history.push(data.line);

        io.emit('dibujando',data);

    });

});
