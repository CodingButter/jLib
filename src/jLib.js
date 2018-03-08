(function(window){
    //SETUP DRAW
    window.FPS =3D 30;
    window.delta_time =3D 0;
    window.onload =3D function(){
        if(setup)
            setup();
        if(draw)
            Loop();
    }

    function Loop(){
        let last_time =3D 0;
        function dr(time){
            delta_time+=3Dtime-last_time;
            last_time =3D time;
            if(delta_time>(1000/FPS)*2){
                delta_time =3D 0;
            }
            if(delta_time>=3D1000/FPS){
                draw();
                delta_time-=3D1000/FPS;
            }
            requestAnimationFrame(dr);
        }
        requestAnimationFrame(dr);
    }
    window.setFPS =3D function(val){
        FPS =3D val;
    }

    //CANVAS CONTEXT
    window.createCanvas =3D function(w,h,element){
        element =3D element || document.body;
        window.width =3D w;
        window.height =3D h;
        window.canvas =3D document.createElement("canvas");
        window.canvas.width =3D width;
        window.canvas.height =3D height;
        element.appendChild(canvas);
        window.ctx =3D canvas.getContext("2d");
    }
    window.fillStyle =3D function(val){
        ctx.fillStyle =3D val;
    }
    window.fillRect =3D function(x,y,w,h){
        ctx.fillRect(x,y,w,h);
    }
    window.background =3D function(val){
        ctx.fillStyle=3Dval;
        ctx.fillRect(0,0,width,height);
    }
    window.clear =3D function(){
        ctx.clearRect(0,0,width,height);
    }


})(window);
