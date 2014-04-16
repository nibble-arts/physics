//var gl;
var stage;

var Physics = {
	damping: 5,
	
};

function load() {

	stage = new Kinetic.Stage({
		container: "table",
		width: 1000,
		height: 800,
		stroke: "black",
		strokeWidth: 1,
	});

	var layer = new Kinetic.Layer();

// create objects
	var greenbox = new Kinetic.Rect({
		name: "green",
		x: 200,
		y: 50,
		width: 100,
		height: 50,
		offsetX: 50,
		offsetY: 25,
		fill: "green",
		stroke: "black",
		strikeWidth: 4,
		shadowColor: "black",
		shadowBlur: 10,
		shadowOffset: { x:4,y:4 },
		shadowOpacity: 0.5,
		draggable: true,
    dragBoundFunc: function(pos) {
			excentric(this);

    	return {
    		x: pos.x,
    		y: pos.y,
    	}
    }
	});
	layer.add(greenbox);

	var redbox = new Kinetic.Rect({
		name: "red",
		x: 400,
		y: 150,
		width: 100,
		height: 100,
		offsetX: 50,
		offsetY: 50,
		fill: "red",
		stroke: "black",
		strikeWidth: 4,
		shadowColor: "black",
		shadowBlur: 10,
		shadowOffset: { x:4,y:4 },
		shadowOpacity: 0.5,
		draggable: true,
    dragBoundFunc: function(pos) {
			excentric(this);

			if (this.radius) {
				this.setRotation(this.getRotation() + this.vx);
			}

    	return {
    		x: pos.x,
    		y: pos.y,
    	}
    }
	});
	layer.add(redbox);

	var bluebox = new Kinetic.Rect({
		name: "blue",
		x: 400,
		y: 300,
		width: 100,
		height: 50,
		offsetX: 50,
		offsetY: 25,
		fill: "blue",
		stroke: "black",
		strikeWidth: 4,
		shadowColor: "black",
		shadowBlur: 10,
		shadowOffset: { x:4,y:4 },
		shadowOpacity: 0.5,
		draggable: true,
    dragBoundFunc: function(pos) {
			excentric(this);

    	return {
    		x: pos.x,
    		y: pos.y
    	}
    }
	});
	layer.add(bluebox);


// add layer to stage
	stage.add(layer);


// set drag events
	greenbox.on("dragend", function () {
		if (this.speed > 1) {
			animate(this,layer);
		}
	});

	bluebox.on("dragend", function () {
		if (this.speed > 1) {
			animate(this,layer);
		}
	});

	redbox.on("dragend", function () {
		if (this.speed > 1) {
			animate(this,layer);
		}
	});


// set click events
	greenbox.on("click", function () {
		this.moveToTop();
		layer.draw();
	});

	bluebox.on("click", function () {
		this.moveToTop();
		layer.draw();
	});

	redbox.on("click", function () {
		this.moveToTop();
		layer.draw();
	});
}


// get excenricy of object
function excentric(node) {
	var oldMouse = {};

	var mouse = stage.getPointerPosition();
	var pos = node.getAbsolutePosition();

	(stage.oldMouse) ? oldMouse = stage.oldMouse:oldMouse=mouse;
	stage.oldMouse = mouse;

	node.vx = mouse.x - oldMouse.x;
	node.vy = mouse.y - oldMouse.y;
	node.speed = Math.abs(Math.sqrt(node.vx*node.vx + node.vy*node.vy));

	node.dx = mouse.x - pos.x;
	node.dy = mouse.y - pos.y;

	node.radius = Math.sqrt(node.dx*node.dx + node.dy*node.dy);
}


// dragoff animation
function animate(node,layer) {
	var damping = Physics.damping;

	var dampX = Math.abs(node.vx/100 * damping);
	var dampY = Math.abs(node.vy/100 * damping);

	var anim = new Kinetic.Animation(function(frame) {

		node.x(node.getPosition().x+node.vx);
		node.y(node.getPosition().y+node.vy);

// canvas collision
		if (node.getPosition().x > stage.getWidth()) node.vx = -node.vx;
		if (node.getPosition().x < stage.getPosition().x) node.vx = -node.vx;
		if (node.getPosition().y > stage.getHeight()) node.vy = -node.vy;
		if (node.getPosition().y < stage.getPosition().y) node.vy = -node.vy;

// damping
		if (Math.round(node.vx))
			(node.vx > 0) ? node.vx -= dampX:node.vx += dampX;
		else node.vx = 0;

		if (Math.round(node.vy))
			(node.vy > 0) ? node.vy -= dampY:node.vy +=dampY;
		else node.vy = 0;
		
		node.speed = Math.abs(Math.sqrt(node.vx*node.vx + node.vy*node.vy));

		if (!Math.round(node.speed)) anim.stop()

$("#x").html(node.vx);
$("#y").html(node.vy);

//				if (frame.time > 10000) anim.stop();
  }, layer);

	anim.start();
}
