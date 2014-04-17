//================================================================
// get excenricy of object
function getDrag(node) {
	var oldMouse = {};

	var mouse = stage.getPointerPosition();
	var pos = node.getAbsolutePosition();

	(stage.oldMouse) ? oldMouse = stage.oldMouse:oldMouse=mouse;
	stage.oldMouse = mouse;

	node.px = mouse.x;
	node.py = mouse.y;
	
	node.vx = mouse.x - oldMouse.x;
	node.vy = mouse.y - oldMouse.y;
	node.speed = Math.abs(Math.sqrt(node.vx*node.vx + node.vy*node.vy));

	node.dx = mouse.x - pos.x;
	node.dy = mouse.y - pos.y;
	node.radius = Math.sqrt(node.dx*node.dx + node.dy*node.dy);
}


//================================================================
// dragoff inertia animation
function animate (node) {
	var layer = node.getLayer();
	var friction = node.getAttr("friction");
	var maxSpeed = node.getAttr("maxSpeed");

// set maximum speed
	if (maxSpeed) {
		if (node.vx) {
			var vxr = node.vx / Math.abs(node.vx);
			node.vx = vxr * Math.min(Math.abs(node.vx),maxSpeed);
		}

		if (node.vy) {
			var vyr = node.vy / Math.abs(node.vy);
			node.vy = vyr * Math.min(Math.abs(node.vy),maxSpeed);
		}
	}


// calculate damping
	var damping = node.getAttr("damping");
	var dampX = Math.abs(node.vx/100 * damping);
	var dampY = Math.abs(node.vy/100 * damping);

	var anim = new Kinetic.Animation(function(frame) {
//		getCollision(node);

		node.x(node.getX() + node.vx);
		node.y(node.getY() + node.vy);

// canvas reflection
		if (node.getX() > stage.getWidth()) node.vx = -node.vx;
		if (node.getX() < stage.getPosition().x) node.vx = -node.vx;
		if (node.getY() > stage.getHeight()) node.vy = -node.vy;
		if (node.getY() < stage.getPosition().y) node.vy = -node.vy;

// damping
		if (Math.round(node.vx))
			(node.vx > 0) ? node.vx -= dampX:node.vx += dampX;
		else node.vx = 0;

		if (Math.round(node.vy))
			(node.vy > 0) ? node.vy -= dampY:node.vy +=dampY;
		else node.vy = 0;

		node.speed = Math.abs(Math.sqrt(node.vx*node.vx + node.vy*node.vy));

		if (!Math.round(node.speed)) anim.stop()
  }, layer);

	anim.start();
}


//================================================================
// rotation
function setRotation (node) {
	if (!node.fixed) {
		var v = new Vector(node.vx,-node.vy);
		var d = new Vector(node.dx,-node.dy);

		if(v.abs()) {
			var angle = Math.acos(Math.abs(Vector.product(v,d)) / (v.abs() * d.abs()));
			var ex = Vector.ex(v,d);
	
			if (ex.z)
				node.setRotation(node.getRotation() + angle * ex.z / Math.abs(ex.z));
		}
	}
}


//================================================================
// get collisions
function getCollision (node) {
	var objects = stage.find("Group");

	objects.each(function (shape) {
		if (node.getName() != shape.getName()) {
			var dist = getDistance(node,shape);
			var radius = node.getAttr("forceRadius");

			if (dist.abs() < radius) {
				shape.vx = dist.unify().scale(node.speed).x;
				shape.vy = dist.unify().scale(node.speed).y;

				animate(shape);
			}
		}
	});
}


//================================================================
// get distance of object centers
function getDistance (a,b) {
	return new Vector(b.getX()-a.getX(),b.getY()-a.getY());
}


//================================================================
//================================================================
// vector arithmetics
function Vector (x,y,z) {
	this.x = x;
	this.y = y;
	(z) ? this.z = z:this.z = 0;
}

// return vector as string
Vector.prototype.toString = function () {
	return ("("+this.x+","+this.y+","+this.z+")");
}

// return length of vector
Vector.prototype.abs = function () {
	return (Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2) +Math.pow(this.z,2)));
}

// multiply vector
Vector.prototype.scale = function (s) {
	if (s == undefined) s = 1;
	return new Vector (this.x*s,this.y*s,this.z*s);
}

// normate vector
Vector.prototype.unify = function () {
	if (this.abs())
		return (this.scale(1/this.abs()));
	else return this;
}

// rotate vector
Vector.prototype.rotate = function (angle) {
	angle = angle / 180 * Math.PI;
	
	var x = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
	var y = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));

	return new Vector(x,y);
}

// translate vector
Vector.prototype.translate = function (x,y,z) {
	if (!z) z = 0;
	return new Vector(this.x+x,this.y+y,this.z+z);
}

// return scalar procuct of vectors
Vector.product = function (v1,v2) {
	return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
}

// return ex-product of vectors
Vector.ex = function (v1,v2) {
	var x = (v1.y * v2.z) - (v1.z * v2.y);
	var y = (v1.x * v2.z) - (v1.z * v2.x);
	var z = (v1.x * v2.y) - (v1.y * v2.x);

	return new Vector(x,y,z);
}



//================================================================
//================================================================
// line arithmetics
function Line (v1,v2) {
	this.v1 = v1;
	this.v2 = v2;
}

// get intersection point for two lines
Line.intersect = function (l1,l2) {
	var a1 = l1.v1;
	var a2 = l1.v2;
	var b1 = l2.v1;
	var b2 = l2.v2;

	var ua;
	var ub;

	var nom = ((b2.y-b1.y)*(a2.x-a1.x))-((b2.x-b1.x)*(a2.y-a1.y));
	if (nom) {

		ua = ((b2.x-b1.x)*(a1.y-b1.y))-((b2.y-b1.y)*(a1.x-b1.x)) / nom;
		ub = ((a2.x-a1.x)*(a1.y-b1.y))-((a2.y-a1.y)*(a1.x-b1.x)) / nom;

console.log(ua+" "+ub);

		if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1)
			return new Vector(ua,ub);
		else return false;
	}
	else return false;
}

