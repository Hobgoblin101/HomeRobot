function DistanceProb(location, rotation){
  var point = new Vector2(0,1);
  point.rotation = rotation;
  var dist;

  var length = 450 / gridSize;
  for (let i=0; i<length; i++){
    var x = Math.sin(rotation.radians) * i /*+ (Math.random()*0.3 - 0.15)*/;
    var y = Math.cos(rotation.radians) * i /*+ (Math.random()*0.3 - 0.15)*/;

    var hit = world.get(
      x + (location.x/gridSize),
      y + (location.y/gridSize)
    );

    if (hit){
      dist = Math.sqrt(x*x + y*y) * gridSize;
      break;
    }
  }

  if (isNaN(dist) || dist > 450){
    return 450;
  }
  return dist;
}
