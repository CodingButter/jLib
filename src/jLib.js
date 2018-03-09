(function (scope) {
    //Statics
    scope.PI = Math.PI;
    scope.HALF_PI = Math.PI / 2;
    scope.QUARTER_PI = Math.PI / 4;
    //Initialize
    scope.current_translate = {
        x: 0,
        y: 0
    };
    scope.center_rect = false;
    scope.center_shape = false;
    scope.rotate_val = false;
    scope.clear_canvas = true;
    scope.rotate_unit = "radians";
    scope.mouse_x = 0;
    scope.mouse_y = 0;
    scope.GET = getGET(location.href);
    //SETUP DRAW
    scope.canvas;
    scope.ctx;
    scope.FPS = 30;
    scope.DELTA_TIME = 0;
    scope.TIME = 0;
    scope.Width = 0;
    scope.Height = 0;
    scope.preloads = {};
    onload = function () {
        if(scope.setup)
            scope.setup();
        if(scope.draw)
            Loop();
    }

    function Loop() {
        let last_time = 0;

        function lp(time) {
            scope.TIME = time;
            scope.DELTA_TIME += time - last_time;
            last_time = time;
            if(scope.DELTA_TIME > (1000 / scope.FPS) * 2) {
                scope.DELTA_TIME = 0;
            }
            if(scope.DELTA_TIME >= 1000 / scope.FPS) {
                inner_draw();
                scope.DELTA_TIME -= 1000 / scope.FPS;
            }
            requestAnimationFrame(lp);
        }
        requestAnimationFrame(lp);
    }
    scope.setFPS = function (val) {
        scope.FPS = val;
    }

    function inner_draw() {
        scope.current_translate = {x:0,y:0};
        if(scope.clear_canvas && typeof scope.ctx != "undefined") {
            scope.ctx.setTransform(1, 0, 0, 1, 0, 0);
            scope.ctx.clearRect(0, 0, Width, Height);
        }
        scope.draw();
    }
    //CANVAS CONTEXT
    scope.createCanvas = function (w, h, element) {
        element = element || document.body;
        h = h || w;
        Width = w;
        Height = h;
        scope.canvas = document.createElement("canvas");
        scope.canvas.width = Width;
        scope.canvas.height = Height;
        element.appendChild(scope.canvas);
        scope.ctx = scope.canvas.getContext("2d");
        scope.canvas.addEventListener("mousemove", function (e) {
            scope.mouse_x = scope.current_translate.x - e.clientX;
            scope.mouse_y = scope.current_translate.y - e.clientY;
        });
        for(var property in scope.ctx){
            if(!scope[property]){
                switch(typeof scope.ctx[property]){
                    case "function":
                        scope[property] = function(){
                            return scope.ctx[property](arguments);
                        }
                    case "string":
                    case "number":
                        scope[property] = function(val){
                            scope.ctx[property] = val;
                        }
                    break;
                }
            }
        }
    }
    scope.globalAlpha = function(val){
        return scope.ctx.globalAlpha = val;
    }
    scope.drawImage = function(img,x,y,width,height,crop_x,crop_y,crop_width,crop_height){ 

        if(!scope.preloads[img]){
            var imge = new Image();
            imge.src = img;
            scope.preloads[img] = imge;
        }
        eval("scope.ctx.drawImage(scope.preloads[img],x,y"+(width?",width":"")+(height?",height":"")+(crop_x?",crop_x":"")+(crop_y?",crop_y":"")+(crop_width?",crop_width":"")+(crop_height?",crop_height":"")+");");
    }
    scope.setCanvasSize = function (w, h) {
        h = h || w;
        scope.canvas.width = w;
        scope.canvas.height = h;
        Width = w;
        Height = h;
    }
    scope.createRadialGradient = function(x1,y1,r,x2,y2,val){
        return scope.ctx.createRadialGradient(x1,y1,r,x2,y2,val);
    }
    scope.fillColor = function (r, g, b, a) {
        scope.ctx.fillStyle = getColor(r, g, b, a);
    }
    scope.strokeColor = function (r, g, b, a) {
        scope.ctx.strokeStyle = getColor(r, g, b, a);
    }
    scope.resetRectOrigin = function () {
        scope.center_rect = false;
    }
    scope.centerRect = function (make_global) {
        if(make_global)
            scope.center_rect = "always";
        else
            scope.center_rect = true;
    }
    scope.fillRect = function (x, y, w, h) {
        scope.ctx.translate(x, y);
        if(scope.rotate_val !== false) {
            scope.ctx.rotate(scope.rotate_val);
        }
        if(scope.center_rect == true || scope.center_rect == "always")
            scope.ctx.fillRect(-(w / 2), -(h / 2), w, h);
        else
            scope.ctx.fillRect(0, 0, w, h);
        if(scope.center_rect === true)
            scope.center_rect = false;
        if(scope.rotate_val !== false) {
            scope.ctx.rotate(-scope.rotate_val);
            scope.rotate_val = false;
        }
        scope.ctx.translate(-x, -y);
    }
    scope.strokeRect = function (x, y, w, h) {
        scope.ctx.translate(x, y);
        if(scope.rotate_val !== false) {
            scope.ctx.rotate(scope.rotate_val);
        }
        if(scope.center_rect == true || scope.center_rect == "always")
            scope.ctx.strokeRect(-(w / 2), -(h / 2), w, h);
        else
            scope.ctx.strokeRect(0, 0, w, h);
        if(scope.center_rect === true)
            scope.center_rect = false;
        if(scope.rotate_val !== false) {
            scope.ctx.rotate(-scope.rotate_val);
            scope.rotate_val = false;
        }
        scope.ctx.translate(-x, -y);
    }
    scope.fillCircle = function (x, y, r) {
        scope.ctx.beginPath();
        scope.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        scope.ctx.fill();
        scope.ctx.closePath();
    }
    scope.background = function (r, g, b, a) {
        scope.ctx.fillStyle = getColor(r, g, b, a);
        scope.ctx.fillRect(0, 0, Width, Height);
    }
    scope.clear = function () {
        scope.ctx.clearRect(0, 0, Width, Height);
    }
    scope.disableClearCanvas = function () {
        scope.clear_canvas = false;
    }
    scope.enableClear = function () {
        scope.clear_canvas = true;
    }
    scope.rotateRect = function (val) {
        scope.rotate_val = toRadians(val);
    }
    scope.rotateShape = function (val) {
        scope.rotate_val = toRadians(val);
    }
    scope.rotate = function (val) {
        scope.ctx.rotate(toRadians(val));
    }
    scope.setRotationUnit = function (val) {
        scope.rotate_unit = val || "degrees";
    }
    scope.translate = function (x, y) {
        y = y || x;
        scope.current_translate.x += x;
        scope.current_translate.y += y;
        scope.ctx.translate(x, y);
    }
    scope.getTranslate = function () {
        return scope.current_translate;
    }
   scope. line = function (x1, y1, x2, y2) {
        scope.ctx.beginPath();
        scope.ctx.moveTo(x1, y1);
        scope.ctx.lineTo(x2, y2);
        scope.ctx.stroke();
        scope.ctx.closePath();
    }
    scope.rotateShape = function (val) {
        scope.rotate_val = toRadians(val);
    }
    scope.centerShape = function (make_global) {
        if(make_global)
            scope.center_shape = "always";
        else
            scope.center_shape = true;
    }
    scope.shape = function (points) {
        beginPath();
        let center = {
            x: 0,
            y: 0
        };
        if(scope.center_shape) {
            center = findCenter(points);
        }
        if(scope.rotate_val !== false) {
            scope.ctx.rotate(scope.rotate_val);
        }
        scope.ctx.moveTo(points[0].x - center.x, points[0].y - center.y);
        for(var i = 1; i < points.length; i++) {
            scope.ctx.lineTo(points[i].x - center.x, points[i].y - center.y);
        }
        scope.ctx.lineTo(points[0].x - center.x, points[0].y - center.y);
        if(scope.center_shape === true)
            scope.center_shape = false;
        if(scope.rotate_val !== false) {
            scope.ctx.rotate(-scope.rotate_val);
            scope.rotate_val = false;
        }
    }
    scope.getMousePosition = function () {
        return {
            x: scope.mouse_x,
            y: scope.mouse_y
        };
    }
    //Math functions
    scope.SIN = function (val) {
        return Math.sin(toRadians(val));
    }
    scope.COS = function (val) {
        return Math.cos(toRadians(val));
    }
    scope.ABS = function(val){
        return Math.abs(val);
    }
    scope.FLOOR = function (val) {
        return Math.floor(val);
    }
    scope.RANDOM = function (min, max) {
        if(typeof min == "undefined")
            return Math.random();
        if(typeof max == "undefined")
            return Math.random() * min;
        return Math.random() * (max - min) + min;
    }
    scope.RANDOM_INT = function (min, max) {
        return FLOOR(RANDOM(min, max + 1));
    }
   
    //Private Methods
    function getGET(url) {
        getvars = {};
        if(url.indexOf("?") > -1) {
            var peram_string = url.split("?")[1];
            var peram_vars = peram_string.split("&");
            for(var i = 0; i < peram_vars.length; i++) {
                var peram = peram_vars[i];
                var key_val = peram.split("=");
                getvars[key_val[0]] = key_val[1];
            }
        }
        return getvars;
    }

    function getColor(r, g, b, a) {
        if(r!== undefined && g!==undefined && b!==undefined && a !==undefined)
            return "rgba(" + r + "," + g + "," + b + "," + a + ")";
        if(r!== undefined && g!==undefined && b!==undefined)
            return "rgba(" + r + "," + g + "," + b + ",1)";
        if(typeof r == "object")
            return r;
        if(typeof r == "string")
            if(r.indexOf("#") > -1)
                return hexToRgbA(r);
            else
                return r;
        return "rgba(" + r + "," + r + "," + r + ",1)";
    }

    function hexToRgbA(hex) {
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if(c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
        }
        throw new Error('Bad Hex');
    }

    function toRadians(val) {
        if(scope.rotate_unit == "degrees")
            return val * (Math.PI / 180);
        else
            return val;
    }

    function findCenter(points) {
        var sum_x = 0;
        var sum_y = 0;
        for(var i = 0; i < points.length; i++) {
            sum_x += points[i].x
            sum_y += points[i].y;
        }
        return {
            x: FLOOR(sum_x / points.length),
            y: FLOOR(sum_y / points.length)
        };
    }

    function findSize(points) {
        var min_x = points[0].x;
        var min_y = points[0].y;
        var max_x = min_x;
        var max_y = min_y;
        for(var i = 0; i < points.length; i++) {
            min_x = (points[i].x < min_x) ? points[i].x : min_x;
            min_y = (points[i].y < min_y) ? points[i].y : min_y;
            max_x = (points[i].x > max_x) ? points[i].x : max_x;
            max_y = (points[i].y > max_y) ? points[i].y : max_y;
        }
        return {
            width: max_x - min_x,
            height: max_y - min_y
        };
    }
})(this);

