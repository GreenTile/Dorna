var origami = new OrigamiPaper("canvas-cp");
origami.cp.crease(0, 0, 0.5, 1);
origami.draw();

// event handlers for touch input
origami.onMouseDown = function(event){
}
origami.onMouseUp = function(event){
}
origami.onMouseMove = function(event){
}
origami.onMouseDidBeginDrag = function(event){
}
// the animation function, this runs many times per second
origami.onFrame = function(event){
}


/**********************************console mode******************************************** */
//creating model
var cp = new CreasePattern();
cp.crease(0, 0, 0.5, 1).valley();
cp.crease(1, 0.5,0,0).valley();
var svg = cp.foldSVG();
console.log(svg);
//download file handling
var element = document.createElement('a');
element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(svg));
element.setAttribute('download', 'folded.svg');
document.body.appendChild(element);
element.click();
document.body.removeChild(element);