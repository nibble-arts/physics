//var gl;
var stage;
var stageWidth;
var stageHeight;

//================================================================
// create stage with objects
function load() {
	// get screen size
	stageWidth = $(document).width();
	stageHeight = $(document).height();

	var boxSizeMin = 150;
	var boxSizeMax = 300;
	var boxAspect = 1.5;

	var imageObj = new Array;
	var image = new Array;
	

// create kinetic stage
	stage = new Kinetic.Stage({
		container: "table",
		width: stageWidth,
		height: stageHeight,
		stroke: "black",
		strokeWidth: 1,
	});

	var layer = new Kinetic.Layer();

	for (i = 1;i < 30;i++) {
		var x = Random(200,stageWidth-200);
		var y = Random(200,stageHeight-200);
		var angle = Random(-45,45);

		var width = Random(boxSizeMin,boxSizeMax);
		var height = Random(boxSizeMin / boxAspect,boxSizeMax / boxAspect);

		var forceRadius = new Vector(width,height).abs();

		var color = "rgb("+Random(0,255)+","+Random(0,255)+","+Random(0,255)+")";

//================================================================
// create objects
		var group = new Kinetic.Group({
			"name": "group_"+i,
			x: x,
			y: y,
			width: width,
			height: height,
			rotation: angle,
			offsetX: width/2,
			offsetY: height/2,
			rotation: angle,
			draggable: true,
		  dragBoundFunc: function(pos) {
				getDrag(this);
				setRotation(this);
				getCollision(this);

		  	return {
		  		x: pos.x,
		  		y: pos.y,
		  	}
		  },
			fixed: false,
			forceRadius: forceRadius/2,
			damping: 5,
			friction: 0.2,
			maxSpeed: 5,
			rotMin: -45,
			rotMax: 45,
		});


//-----------------------------------------------------------------
// backgroud box
		var box = new Kinetic.Rect({
			"name": "box_"+i,
			x: 0,
			y: 0,
			width: width,
			height: height,
			offsetX: width/2,
			offsetY: height/2,
			fill: "#f0f0f0",//color,
			stroke: "black",
			strokeWidth: 1,
	//		shadowColor: "black",
	//		shadowBlur: 10,
	//		shadowOffset: { x:4,y:4 },
	//		shadowOpacity: 0.5,
		});
		group.add(box);


//-----------------------------------------------------------------
// image
		imageObj[i] = new Image();

		imageObj[i].onload = function () {

			image = new Kinetic.Image({
				name: "image_"+i,
				alt: "Image "+i,
				image: imageObj[i],
				x: 0,
				y: 20,
				width: width-2,
				height: height-22,
				offsetX: width/2-1,
				offsetY: height/2-1,
			});

			group.add(image);
		}
		
		if (i < 10)
			imageObj[i].src = "images/00"+i+".jpg";
		else
			imageObj[i].src = "images/0"+i+".jpg";


//-----------------------------------------------------------------
// text
		var text = new Kinetic.Text({
      x: -width/2 + 5,
      y: -height/2 + 5,
      text: "Box "+i,
      fontSize: 12,
      fontFamily: "Calibri",
      fill: "black",
      align: "center",
		});
		group.add(text);


//================================================================
		layer.add(group);

//================================================================
// set drag animation
		group.on("dragstart", function () {
			resetNodes(this);
		});

		group.on("dragend", function () {
			if (this.speed > 1) {
				animate(this);
			}
		});


//================================================================
// set click events
		group.on("click", function () {
			if (this.getScaleX() > 1)
				resetNodes();
			else {
				resetNodes(this);

				this.fixed = true;
				this.vx = 0;
				this.vy = 0;
				
				new Kinetic.Tween({
		      node: this, 
		      duration: 1,
					rotation: 0,
					x: stageWidth/2 + 2 * this.getOffset().x,
					y: stageHeight/2 + 2 * this.getOffset().y,
					scaleX: 2,
					scaleY: 2,
		      easing: Kinetic.Easings.EaseIn
		    }).play();

				this.moveToTop();
				layer.draw();
			}

		});
	}

// add layer to stage
	stage.add(layer);
}



//================================================================
// reset scale and set random rotation to all nodes exept node
function resetNodes(node) {
	var nodes = stage.find("Group");

// loop nodes
	nodes.each(function (shape) {
		if (!node || (node && node.getName() != shape.getName())) {
			if (shape.getScale().x > 1) {
				shape.fixed = false;
				
				new Kinetic.Tween({
				  node: shape, 
				  duration: 1,
					rotation: Random(-45,45),
					x: Random(150,stageWidth-150),
					y: Random(150,stageHeight-150),
					scaleX: 1,
					scaleY: 1,
				  easing: Kinetic.Easings.EaseIn
				}).play();
			}
		}
	});
}





//================================================================
//================================================================
// return random number between values
function Random(start,end) {
	return Math.round(Math.random()*(end-start)+start);
}