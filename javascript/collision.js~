//================================================================
// intersect rectangles
function getIntersections (node,shape) {
	if (node.getName() != shape.getName()) {
		var nodeLines = getlines(node);
		var shapeLines = getlines(shape);

	// intersect lines of node with shape
		$.each(nodeLines, function (i,nl) {
			$.each(shapeLines, function (j,sl) {
				Line.intersect(nl,sl);
			});
		});
	}
}


//================================================================
// get array of lines from rectangle
function getlines (node) {
	var x = node.getX();
	var y = node.getY();

	var width = node.getWidth();
	var height = node.getHeight();
	var angle = node.getRotation();
	var offset = node.getOffset();

	var p1 = new Vector(-offset.x,-offset.y);
	var p2 = new Vector(-offset.x+width,-offset.y);
	var p3 = new Vector(-offset.x+width,-offset.y+height);
	var p4 = new Vector(-offset.x,-offset.y+height);

	var v1 = p1.rotate(angle).translate(x,y);
	var v2 = p2.rotate(angle).translate(x,y);
	var v3 = p3.rotate(angle).translate(x,y);
	var v4 = p4.rotate(angle).translate(x,y);

	var lines = new Array;
	lines.push(new Line(v1,v2));
	lines.push(new Line(v2,v3));
	lines.push(new Line(v3,v4));
	lines.push(new Line(v4,v1));

	return lines;
}


//================================================================
// check for collision
function doObjectsCollide(a, b) { // a and b are your objects
	return !(
		((a.getY() - a.getOffsetY() + a.getHeight()) < (b.getY() - b.getOffsetY())) ||
		((a.getY() - a.getOffsetY()) > (b.y - b.getOffsetY() + b.getHeight())) ||
		((a.getX() - a.getOffsetX() + a.getWidth()) < (b.getX() - b.getOffsetX())) ||
		((a.getX() - a.getOffsetX()) > (b.getX() - b.getOffsetX() + b.getWidth()))
	);
}


//================================================================
// check for collision of rotated rectangles
function isCollision(a,b) {

	var x10 = a.getX();
	var y10 = a.getY();
	var height1 = a.getHeight() / 2;
	var width1 = a.getWidth() / 2;

	var x20 = b.getX();
	var y20 = b.getY();
	var height2 = b.getHeight() / 2;
	var width2 = b.getWidth() / 2;

	var radrot1 = a.getRotation();
	var radrot2 = b.getRotation();
	
	var radius1 = Math.sqrt( height1*height1 + width1*width1 );
	var radius2 = Math.sqrt( height2*height2 + width2*width2 );
     
	var angle1 = Math.asin( height1 / radius1 );
	var angle2 = Math.asin( height2 / radius2 );
     
	var x1 = new Array;
	var y1 = new Array;
	var x2 = new Array;
	var y2 = new Array;
     
	x1[1] = x10 + radius1 * Math.cos(radrot1 - angle1);
	y1[1] = y10 + radius1 * Math.sin(radrot1 - angle1);

	x1[2] = x10 + radius1 * Math.cos(radrot1 + angle1);
	y1[2] = y10 + radius1 * Math.sin(radrot1 + angle1);
	
	x1[3] = x10 + radius1 * Math.cos(radrot1 + Math.pi - angle1);
	y1[3] = y10 + radius1 * Math.sin(radrot1 + Math.pi - angle1);
	
	x1[4] = x10 + radius1 * Math.cos(radrot1 + Math.pi + angle1);
	y1[4] = y10 + radius1 * Math.sin(radrot1 + Math.pi + angle1);
     
	x2[1] = x20 + radius2 * Math.cos(radrot2 - angle2);
	y2[1] = y20 + radius2 * Math.sin(radrot2 - angle2);
	
	x2[2] = x20 + radius2 * Math.cos(radrot2 + angle2);
	y2[2] = y20 + radius2 * Math.sin(radrot2 + angle2);
	
	x2[3] = x20 + radius2 * Math.cos(radrot2 + Math.pi - angle2);
	y2[3] = y20 + radius2 * Math.sin(radrot2 + Math.pi - angle2);
	
	x2[4] = x20 + radius2 * Math.cos(radrot2 + Math.pi + angle2);
	y2[4] = y20 + radius2 * Math.sin(radrot2 + Math.pi + angle2);
     
	var axisx = {};
	var axisy = {};
     
	axisx[1] = x1[1] - x1[2];
	axisy[1] = y1[1] - y1[2];
	
	axisx[2] = x1[3] - x1[2];
	axisy[2] = y1[3] - y1[2];
	
	axisx[3] = x2[1] - x2[2];
	axisy[3] = y2[1] - y2[2];
	axisx[4] = x2[3] - x2[2];
	axisy[4] = y2[3] - y2[2];
     
	for (var k = 1;k < 4;k++) {
    var proj = x1[1] * axisx[k] + y1[1] * axisy[k];
     
		var minProj1 = proj;
		var maxProj1 = proj;
     
		for (var i = 2;i < 4;i++) {
	    proj = x1[i] * axisx[k] + y1[i] * axisy[k];
     
		  if (proj < minProj1)
			  minProj1 = proj;
		  else {
		  	if (proj > maxProj1)
		  		maxProj1 = proj;
			}
		}
     
    proj = x2[1] * axisx[k] + y2[1] * axisy[k];
     
    var minProj2 = proj;
    var maxProj2 = proj;
     
    for (var j = 2;j < 4;j++) {
	    proj = x2[j] * axisx[k] + y2[j] * axisy[k];
     
		  if (proj < minProj2)
			  minProj2 = proj;
		  else {
		  	if (proj > maxProj2)
		  		maxProj2 = proj;
		  }
		}
		     
		if (maxProj2 < minProj1 || maxProj1 < minProj2)
			return false;
	}
	return true;
}

