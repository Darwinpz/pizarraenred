const socket = io();

function init(){
   
    let mouse = {

        click: false,
        move: false,
        position: {x:0,y:0},
        position_prev: false,
        color: 'black'
    };

    //CANVAS
    const canvas = document.getElementById('drawing');
    const context = canvas.getContext('2d');
    const colors = document.getElementsByClassName('color');

    const pinceles = document.getElementsByClassName('pincel');


    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    context.lineWidth = 2;
    
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

    for (var i = 0; i < colors.length; i++){
        colors[i].addEventListener('click', (e)=>{
            mouse.color = e.target.className.split(' ')[1];
            
            if(mouse.color == 'white'){
                context.lineWidth = 10;
            }else{
                context.lineWidth = 2;
            }

        });
    }


    for (var i = 0; i < pinceles.length; i++){
        pinceles[i].addEventListener('click', (e)=>{
            tipo = e.target.className.split(' ')[1];
            
            if(tipo == 'pincel1'){
                context.lineWidth = 2;
            }else if(tipo == 'pincel2'){
                context.lineWidth = 10;
            }

        });
    }

    socket.on('dibujando',(data)=>{

        const line = data.line;

        context.beginPath();
        context.moveTo(line[0].x*width,line[0].y *height);
        context.lineTo(line[1].x*width,line[1].y *height);
        context.strokeStyle = data.color;
        context.stroke();

    });

    function mainLoop(){

        if (mouse.click && mouse.move &&mouse.position_prev){

            socket.emit('dibujando',{line:[mouse.position,mouse.position_prev],color:mouse.color});  
            mouse.move = false;
        
        }

        mouse.position_prev = {x:mouse.position.x,y: mouse.position.y};

        setTimeout(mainLoop,10);

    }

    mainLoop();

}

document.addEventListener('DOMContentLoaded',init);

