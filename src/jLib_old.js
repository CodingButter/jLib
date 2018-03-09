(function (scope) {
    //Statics
    scope.PI = Math.PI;
    scope.HALF_PI = Math.PI / 2;
    scope.QUARTER_PI = Math.PI / 4;
    scope.noise_seed = [];
    //Initialize
    scope.current_translate = {
        x: 0,
        y: 0
    };
    scope.center_rect = false;
    scope.center_shape = false;
    scope.disable_clear = false;
    scope.rotate_val = false;
    scope.rotate_unit = "radians";
    scope.mouse_x = 0;
    scope.mouse_y = 0;
    scope.GET = getGET(scope.location.href);
    //SETUP DRAW
    scope.FPS = 30;
    scope.delta_time = 0;
    scope.onload = function () {
        if(setup)
            setup();
        if(draw)
            Loop();
    }

    function Loop() {
        let last_time = 0;

        function lp(time) {
            delta_time += time - last_time;
            last_time = time;
            if(delta_time > (1000 / FPS) * 2) {
                delta_time = 0;
            }
            if(delta_time >= 1000 / FPS) {
                inner_draw();
                delta_time -= 1000 / FPS;
            }
            requestAnimationFrame(lp);
        }
        requestAnimationFrame(lp);
    }
    scope.setFPS = function (val) {
        FPS = val;
    }

    function inner_draw() {
        if(!disable_clear && typeof ctx != "undefined") {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, Width, Height);
        }
        draw();
    }
    //CANVAS CONTEXT
    scope.createCanvas = function (w, h, element) {
        element = element || document.body;
        h = h || w;
        scope.Width = w;
        scope.Height = h;
        scope.canvas = document.createElement("canvas");
        scope.canvas.width = Width;
        scope.canvas.height = Height;
        element.appendChild(canvas);
        scope.ctx = canvas.getContext("2d");
        canvas.addEventListener("mousemove", function (e) {
            scope.mouse_x = e.clientX;
            scope.mouse_y = e.clientY;
        });
    }
    scope.setCanvasSize = function (w, h) {
        h = h || w;
        canvas.width = w;
        canvas.height = h;
        Width = w;
        Height = h;
    }
    scope.createLinearGradient = function (x, y, stopx, stopy) {
        return ctx.createLinearGradient(x, y, stopx, stopy);
    }
    scope.fillColor = function (r, g, b, a) {
        ctx.fillStyle = getColor(r, g, b, a);
    }
    scope.strokeColor = function (r, g, b, a) {
        ctx.strokeStyle = getColor(r, g, b, a);
    }
    scope.resetRectOrigin = function () {
        center_rect = false;
    }
    scope.centerRect = function (make_global) {
        if(make_global)
            center_rect = "always";
        else
            center_rect = true;
    }
    scope.fillRect = function (x, y, w, h) {
        ctx.translate(x, y);
        if(rotate_val !== false) {
            ctx.rotate(rotate_val);
        }
        if(center_rect == true || center_rect == "always")
            ctx.fillRect(-(w / 2), -(h / 2), w, h);
        else
            ctx.fillRect(0, 0, w, h);
        if(center_rect === true)
            center_rect = false;
        if(rotate_val !== false) {
            ctx.rotate(-rotate_val);
            rotate_val = false;
        }
        ctx.translate(-x, -y);
    }
    scope.strokeRect = function (x, y, w, h) {
        ctx.translate(x, y);
        if(rotate_val !== false) {
            ctx.rotate(rotate_val);
        }
        if(center_rect == true || center_rect == "always")
            ctx.strokeRect(-(w / 2), -(h / 2), w, h);
        else
            ctx.strokeRect(0, 0, w, h);
        if(center_rect === true)
            center_rect = false;
        if(rotate_val !== false) {
            ctx.rotate(-rotate_val);
            rotate_val = false;
        }
        ctx.translate(-x, -y);
    }
    scope.fillCircle = function (x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
    }
    scope.background = function (r, g, b, a) {
        ctx.fillStyle = getColor(r, g, b, a);
        ctx.fillRect(0, 0, Width, Height);
    }
    scope.clear = function () {
        ctx.clearRect(0, 0, Width, Height);
    }
    scope.disableClearCanvas = function () {
        disable_clear = true;
    }
    scope.enableClear = function () {
        disable_clear = false;
    }
    scope.rotateRect = function (val) {
        rotate_val = toRadians(val);
    }
    scope.rotateShape = function (val) {
        rotate_val = toRadians(val);
    }
    scope.rotate = function (val) {
        ctx.rotate(toRadians(val));
    }
    scope.setRotationUnit = function (val) {
        rotate_unit = val || "degrees";
    }
    scope.translate = function (x, y) {
        y = y || x;
        current_translate.x += x;
        current_translate.y += y;
        ctx.translate(x, y);
    }
    scope.getTranslate = function () {
        return current_translate;
    }
    scope.line = function (x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }
    scope.rotateShape = function (val) {
        rotate_val = toRadians(val);
    }
    scope.centerShape = function (make_global) {
        if(make_global)
            center_shape = "always";
        else
            center_shape = true;
    }
    scope.shape = function (points) {
        beginPath();
        let center = {
            x: 0,
            y: 0
        };
        if(center_shape) {
            center = findCenter(points);
        }
        if(rotate_val !== false) {
            ctx.rotate(rotate_val);
        }
        ctx.moveTo(points[0].x - center.x, points[0].y - center.y);
        for(var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x - center.x, points[i].y - center.y);
        }
        ctx.lineTo(points[0].x - center.x, points[0].y - center.y);
        if(center_shape === true)
            center_shape = false;
        if(rotate_val !== false) {
            ctx.rotate(-rotate_val);
            rotate_val = false;
        }
    }
    scope.moveTo = function (x, y) {
        ctx.moveTo(x, y);
    }
    scope.lineTo = function (x, y) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    scope.closePath = function () {
        ctx.closePath();
    }
    scope.beginPath = function () {
        ctx.beginPath();
    }
    scope.stroke = function () {
        ctx.stroke();
        ctx.closePath();
    }
    scope.fill = function () {
        ctx.fill();
        ctx.closePath();
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
    scope.NOISE = function (val) {
        noise_seed = (noise_seed.length == 0) ? setRandomSeed() : noise_seed;
        var perlin = noise_seed.slice(0).fill(0);
        perlin.push(0);
        var scale = 1;
        var total_devs = 0;
        for(var i = 1; i < noise_seed.length; i++) {
            let octiveval = noise_seed[i % noise_seed.length];
            total_devs += 1;
            for(var b = 0; b < perlin.length; b++) {
                perlin[b] += octiveval + noise_seed[b % noise_seed.length] / i;
            }
        }
        perlin = perlin.map(a => a / total_devs);
        return perlin[Math.abs(Math.floor(val % perlin.length))];
    }
    scope.setRandomSeed = function () {
        return Array.from({
            length: 400
        }, () => Math.random());
    }
    scope.getNoiseSeed = function () {
        return noise_seed;
    }
    scope.setNoiseSeed = function (seed) {
        noise_seed = seed;
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
        if(rotate_unit == "degrees")
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

