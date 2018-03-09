	var radius_x;
	var radius_y;
	var center_x;
	var center_y;
	var num_of_items;
	var speed;
	var angle;
	var items;
	var w;
	var h;
	function setup(){
	    createCanvas(800);
	    //disableClearCanvas();
	    setRotationUnit("degrees");
	    //centerRect(true);
	    radius_x = Width/3;
	    radius_y = Height/6;
	    center_x = Width/2;
	    center_y = Height/2;
	    w=20;
	    h=35;
	    num_of_items = parseInt(GET["items"]) || 10;
	    angle = 0;
	    speed = 1;
	    items = [];
	    for(var i=0;i<num_of_items;i++){
	        var a = (360/num_of_items)*i;
	        var x = COS(a)*radius_x;
	        var y = SIN(a)*radius_y;
	        items.push(new Item(x,y,w,h,a));
	    }
	}

	function draw(){
	    background(0);
	    translate(center_x,center_y);
	    speed = (center_x - getMousePosition().x)/(Width/5);
	    items = items.sort(function(a,b){
	        return b.y-a.y;
	    });
	    angle-=speed;
	     for(var i=num_of_items-1;i>=0;i--){
	        items[i].draw(angle);
	     }
	}

	class Item{
	    constructor(x,y,width,height,start_angle){
	        this.x = x;
	        this.y = y;
	        this.hovered = false;
	        this.width = width;
	        this.height = height;
	        this.angle = start_angle;
	        this.color = "green";
	        this.stroke = 'white';
	        this.reflect_space = 10;
	    }
	    draw(a){
	        this.x = -this.width + COS(a+this.angle)*radius_x;
	        this.y = -this.height + SIN(a+this.angle)*radius_y;
	      	
	      	var scale = 3+(this.y/150);
	        fillColor(this.color);
	        strokeColor(this.stroke);
	        fillRect(this.x,this.y,this.width*scale,this.height*scale);
	        strokeRect(this.x,this.y,this.width*scale,this.height*scale);
	        fillColor(0,255,0,.2); 
	        strokeColor(255,255,255,.1); 
	        fillRect(this.x,this.y+(this.height * scale)+(scale * this.reflect_space),this.width*scale,this.height*scale);
	        strokeRect(this.x,this.y+(this.height * scale)+(scale * this.reflect_space),this.width*scale,this.height*scale);
	    }
	}


