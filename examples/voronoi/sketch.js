///////////////////////////////////////////////

function download(text, filename, mimeType){
	var blob = new Blob([text], {type: mimeType});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
document.getElementById("download-file").addEventListener("click", function(e){
	e.preventDefault();
	var svgBlob = project.cp.exportSVG();
	download(svgBlob, "creasepattern.svg", "image/svg+xml");
});
 
/////////////////////////////////////////////

var voronoiAlgorithm; // global D3 algorithm implementation

var project = new OrigamiPaper("canvas-voronoi");
// project.setPadding();
project.thinLines();

var touchNodes = new PlanarGraph();
var touchNodesCircles = [];
var touchNodesLayer


for(var i = 0; i < 3; i++){
	touchNodes.newPlanarNode(Math.random(), Math.random());
}

var dragOn = false;
var selectedNode = undefined;

var interpolation = 0.5;

project.drawVoronoi = function(complex, showGussets){
	var nodes = touchNodes.nodes.map(function(el){return [el.x, el.y];});
	var d3Voronoi = voronoiAlgorithm( nodes );
	var v = new VoronoiGraph(d3Voronoi);
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	if(showGussets == false){
		creaseVoronoi(this.cp, v, interpolation);
	}
	else if(complex == false){
		creaseVoronoi(this.cp, v, interpolation);
	} else{
		creaseVoronoi(this.cp, v, interpolation);
	}
	for(var i = 0; i < touchNodes.nodes.length; i++){
		var position = new XY(touchNodes.nodes[i].x, touchNodes.nodes[i].y);
		this.cp.crease(position.add(new XY(-0.01, 0.00)), position.add(new XY(0.01, 0.00)) );
		this.cp.crease(position.add(new XY(0.00, -0.01)), position.add(new XY(0.00, 0.01)) );
	}

	this.draw();
	touchNodesLayer.activate();
	touchNodesLayer.removeChildren();
	touchNodesCircles = [];
	for(var i = 0; i < touchNodes.nodes.length; i++){
		var nodeCircle = new this.scope.Shape.Circle({ radius: 0.0025, fillColor:this.style.valley.strokeColor});
		touchNodesCircles.push(nodeCircle);
		nodeCircle.position = touchNodes.nodes[i];
	}
	return v;
}

project.reset = function(){
	this.cp.clear();
	this.draw();
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );

	if(touchNodesLayer !== undefined){ touchNodesLayer.removeChildren(); }
	touchNodesLayer = new this.scope.Layer();

	this.drawVoronoi();
}
project.reset();

project.onResize = function(){
	var bounds = this.cp.bounds();
	var boundingBoxD3 = [[bounds.origin.x, bounds.origin.y],[bounds.size.width, bounds.size.height]];
	voronoiAlgorithm = d3.voronoi().extent( boundingBoxD3 );
}

project.onMouseDown = function(event){
	if(selectedNode === undefined){
		if(this.cp.contains(event.point)){ 
			touchNodes.newPlanarNode(event.point.x, event.point.y); 
			this.drawVoronoi();
			selectedNode = undefined;
			for(var i = 0; i < touchNodes.nodes.length; i++){
				if(touchNodesCircles[i] !== undefined){
					var d = touchNodes.nodes[i].distanceTo(event.point);
					if(d < 0.01){ touchNodesCircles[i].radius = 0.005; selectedNode = i;}
					else        { touchNodesCircles[i].radius = 0.0025; }
				}
			}
			dragOn = true;
		}
	} else{
		this.drawVoronoi();
		dragOn = true;
	}
}
project.onMouseUp = function(event){ 
	dragOn = false;
}
project.onMouseMove = function(event) {
	var mouse = event.point;
	if(dragOn){
		touchNodes.nodes[selectedNode].x = mouse.x;
		touchNodes.nodes[selectedNode].y = mouse.y;
		if(!this.cp.contains(mouse.x, mouse.y)){
			dragOn = false;
			touchNodes.nodes.splice(selectedNode,1);
		}
		this.drawVoronoi();
	} else{
		selectedNode = undefined;
		for(var i = 0; i < touchNodes.nodes.length; i++){
			if(touchNodesCircles[i] !== undefined){
				var d = touchNodes.nodes[i].distanceTo(event.point);
				if(d < 0.01){ touchNodesCircles[i].radius = 0.005; selectedNode = i;}
				else        { touchNodesCircles[i].radius = 0.0025; }
			}
		}
	}
}
project.onFrame = function(event){ }
