function DistanceProb(location, rotation){
  var dist = 450; //max distance (cm)

  var point = new Vector2(0,1);
  point.rotation = rotation;

  var length = 450 / gridSize;
  for (let i=0; i<length; i++){
    var x = Math.sin(rotation.radians) * i;
    var y = Math.cos(rotation.radians) * i;

    var hit = world.get(
      x + (location.x/gridSize),
      y + (location.y/gridSize)
    );

    if (hit){
      var ndist = Math.sqrt(x*x + y*y) * gridSize;
      if (ndist < dist){
        dist = ndist;
      }
    }
  }

  return dist > 450 ? 450 : dist;
}
