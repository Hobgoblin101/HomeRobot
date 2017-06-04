function DistanceProb(location, rotation){
  var dist = 450; //max distance (cm)

  var length = 450 / gridSize;
  for (let i=-length; i<length; i++){
    var x = 0;
    var y = 0;
    if (rotation.degrees % 180 === 0){
      x = 0;
      y = i;
    }else if (rotation.degrees % 90 === 0){
      x = i;
      y = 0;
    }else{
      x = i;
      y = x / Math.tan(rotation.radians);
    }

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

  dist += (Math.random()*3 - 1.5);
  return dist > 450 ? 450 : dist;
}
