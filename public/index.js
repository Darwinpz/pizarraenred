const socket = io("192.168.50.42:3000");

function init(){
   
    let mouse = {

        click: false,
        move: false,
        position: {x:0,y:0},
        position_prev: false,
        
    };

    //CANVAS
    const canvas = document.getElementById('drawing');
    const context = canvas.getContext('2d');

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    canvas.addEventListener('mousedown', (e)=>{

        mouse.click = true; 

    });

    canvas.addEventListener('mouseup',(e)=>{
        mouse.click = false;
    });

    canvas.addEventListener('mousemove',(e)=>{

        mouse.position.x = e.clientX / width;
        mouse.position.y = e.clientY / height;
        mouse.move = true;
    });

    socket.on('dibujando',(data)=>{

        const line = data.line;

        context.beginPath();
        context.lineWith = 2;
        context.moveTo(line[0].x*width,line[0].y *height);
        context.lineTo(line[1].x*width,line[1].y *height);
        context.stroke();

    });

    function mainLoop(){

        if (mouse.click && mouse.move &&mouse.position_prev){

            socket.emit('dibujando',{line:[mouse.position,mouse.position_prev]});  
            mouse.move = false;
        
        }

        mouse.position_prev = {x:mouse.position.x,y: mouse.position.y};

        setTimeout(mainLoop,25);

    }

    mainLoop();

}

document.addEventListener('DOMContentLoaded',init);

