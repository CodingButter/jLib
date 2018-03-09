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
var carousel;
function setup(){
    createCanvas(800);
    setRotationUnit("degrees");
    radius_x = GET['radius_x'] || Width/3;
    radius_y = GET['radius_y'] || Height/10;
    center_x = Width/2;
    center_y = Height/2;
    w=50;
    h=40;
    num_of_items = GET["items"] || 10;
    angle = 0;
    speed = 1;
    speed_multi = GET['speed'] || 1;
    carousel = new Carousel(0,0,radius_x,radius_y,num_of_items);
}
function draw(){
	background(0);
	translate(center_x,center_y);
   	carousel.draw();
}

class Carousel{
	constructor(x,y,radius_x,radius_y,num_of_items){
		this.radius_x = radius_x;
	    this.radius_y = radius_y;
	    this.center_x = x;
	    this.center_y = y;
	    this.w=40;
	    this.h=40;
	    this.num_of_items = num_of_items || 10;
	    this.angle = 0;
	    this.speed_multi = GET['speed'] || 1;
	    this.items = [];
	    this.dampen =  0;
	    for(var i=0;i<this.num_of_items;i++){
	        var a = (360/this.num_of_items)*i;
	        var x = this.center_x+COS(a)*this.radius_x;
	        var y = this.center_y+SIN(a)*this.radius_y;
	        this.items.push(new Item(this,x,y,this.w,this.h,a));
	    }
	}
	draw(){
		this.speed = -(this.speed_multi * ((this.center_x - getMousePosition().x)/(Width/5)));
    	this.dampen=(this.speed_multi * ((this.center_y - getMousePosition().y)))/25;
		this.items = this.items.sort(function(a,b){
			return b.y-a.y;
		});
		this.angle-=this.speed;
		for(var i=this.num_of_items-1;i>=0;i--){
			this.items[i].draw(this.angle,this.dampen);
		}
	}
}
class Item{
    constructor(carousel,x,y,width,height,start_angle){
        this.carousel = carousel;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = start_angle;
        this.color = "rgba(0,255,0,.99)";
        this.stroke = 'white';
        this.reflect_space = this.height/5;
    }
    draw(a,d){
        this.x = this.carousel.center_x - this.width + COS(a+this.angle)*radius_x;
        this.y = this.carousel.center_y - this.height + SIN(a+this.angle)*radius_y;
      	var scale = 3+(this.y/150);
      	//this.reflect_space = this.height*2/(scale);
        var bounce= 10+SIN(TIME+this.angle)*ABS(d);
        /*fillColor(0,255,0,.5); 
        strokeColor(255,255,255,.5); 
        fillRect(this.x,-bounce + this.y+(this.height * scale)+(scale * this.reflect_space),this.width*scale,this.height*scale);
       	strokeRect(this.x,-bounce + this.y+(this.height * scale)+(scale * this.reflect_space),this.width*scale,this.height*scale);
        fillColor(this.color);
        strokeColor(this.stroke);
        fillRect(this.x,this.y+bounce,this.width*scale,this.height*scale);
        strokeRect(this.x,this.y+bounce,this.width*scale,this.height*scale);
        */
        globalAlpha(.3);
        ctx.scale(1,-1);
        drawImage("images/js.png",this.x,-bounce - this.y-(this.height*scale)-((scale * this.reflect_space)*3),this.width*scale,this.height*scale);
    	globalAlpha(1);
    	ctx.scale(1,-1);
    	drawImage("images/js.png",this.x,this.y-bounce,this.width*scale,this.height*scale);
    }
}