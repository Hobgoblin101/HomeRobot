var gridSize = 10;

var world = new NArray2D();

function setup(){
  createCanvas(500, 500);
  pixelDensity(1);
  stroke(255);
}

function draw(){
  background(55);
  stroke(55);

  translate(canvas.width/2, canvas.height/2);

  fill(255);
  world.forEach(function(value, x, y){
    if (value){
      rect(
        x*gridSize - gridSize/2,
        y*gridSize - gridSize/2,
        gridSize,
        gridSize
      );
    }
  });

  robot.draw();

  translate(-canvas.width/2, -canvas.height/2);
}
