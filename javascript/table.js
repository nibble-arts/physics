//var gl;
var stage;
var stageWidth;
var stageHeight;
var margin = 100;
var title = [
"","Glas","Roboterhund","Bergwerksmünze","Untertasse","Untersetzer","Celluloselack","Kunstharz E1","Warenprobe","Bahnhof Semmering","Bergbaubetrieb","Correspondenzkarte","Tunnelquerschnitte","Nordwestbahnhof","Donaubrücke bei Wien","Wecker","Anzeigeapparat","Signalgeber","Setzkasten","Setzkastenlade","Hafenschlepper","Schalldose","Tastatus","Zungen","Dampflok-Lenkgestell","Correspondenzkarte Italien","Space Zentrifuge","Vermessungsarbeiten","Zillertalbahn","Ausstellung für Fremdenverkehr","Leiterplatte"
];


//================================================================
// create stage with objects
function load() {
	// get screen size
	stageWidth = $(document).width();
	stageHeight = $(document).height();

	var boxSizeMin = 150;
	var boxSizeMax = 250;
	var boxAspect = 1.5;

	var imageObj = new Array;
	var image = new Array;
	

//================================================================
// create kinetic stage
	stage = new Kinetic.Stage({
		container: "table",
		width: stageWidth,
		height: stageHeight,
		stroke: "black",
		strokeWidth: 1,
	});


//================================================================
// create layer
	var layer = new Kinetic.Layer();
	var background = new Kinetic.Layer();

	var back = new Kinetic.Rect({
		x: 0,
		y: 0,
		width: stageWidth,
		height: stageHeight,
		fill: "#f5f5ff",
		
	});

	background.add(back);
	stage.add(background);

//================================================================
// create objects
	for (i = 1;i <= 30;i++) {
		var angle = Random(-25,25);

		var width = Random(boxSizeMin,boxSizeMax);
		var height = Random(boxSizeMin / boxAspect,boxSizeMax / boxAspect);

		var x = Random(margin + (width / 2),stageWidth - margin);
		var y = Random(margin + (height / 2),stageHeight - margin);

		var forceRadius = new Vector(width,height).abs();

		var color = "rgb("+Random(0,255)+","+Random(0,255)+","+Random(0,255)+")";

// create objects
		var group = new Kinetic.Group({
			id: "group_"+i,
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
			damping: 4,
			maxSpeed: 12,
			rotMin: -25,
			rotMax: 25,
		});


//-----------------------------------------------------------------
// backgroud box
		var box = new Kinetic.Rect({
			id: "box_"+i,
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
		var imageObj = new Image();
		addImage(i,imageObj,Math.max(width,height),group,layer);


//-----------------------------------------------------------------
// text
		var text = new Kinetic.Text({
			id: "text_"+i,
			"name": "text_"+i,
      x: -width/2 + 5,
      y: -height/2 + 5,
      text: title[i],
      fontSize: 10,
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
//			resetNodes(this);
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
// add an image to a group
function addImage(id,imageObj,size,group,layer) {
	imageObj.onload = function () {

		var imgSize = Math.max(imageObj.width,imageObj.height);

		var width = Math.round(imageObj.width / imgSize * size);
		var height = Math.round(imageObj.height / imgSize * size);


		image = new Kinetic.Image({
			id: "image_"+id,
			"name": "image_"+id,
			image: this,
			x: 0,
			y: 20,
			width: width-2,
			height: height-2,
			offsetX: width/2-1,
			offsetY: height/2-1,
		});

		group.add(image);
		layer.add(group);


// resize group
		var shape = stage.find("#group_"+id);
		shape.setWidth(width);
		shape.setOffsetX(width/2);

		shape.setHeight(height + 20);
		shape.setOffsetY(height/2);


// resize box
		var shape = stage.find("#box_"+id);
		shape.setWidth(width);
		shape.setOffsetX(width/2);

		shape.setHeight(height + 20);
		shape.setOffsetY(height/2);


// resize text
		var shape = stage.find("#text_"+id);
		shape.position( {x: (-width/2 + 5),y: (-height/2 + 5) } );


// redraw layer
		layer.draw();
	}

	if (i < 10)
		imageObj.src = "images/00"+i+".jpg";
	else
		imageObj.src = "images/0"+i+".jpg";
}




//================================================================
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
					x: Random(margin + shape.getOffsetX(),stageWidth - margin),
					y: Random(margin + shape.getOffsetY(),stageHeight - margin),
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
