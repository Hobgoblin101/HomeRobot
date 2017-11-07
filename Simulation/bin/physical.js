var physical = {
  //FOR SIMULATION PURPOSES
  location: new Vector2(),
  rotation: 0,
  probeRot: 0,


  probe: function(callback){
    //Intervals
    var intx = Math.cos(physical.rotation + physical.probeRot)/4;
    var inty = Math.sin(physical.rotation + physical.probeRot)/4;
    var intDist = Math.sqrt(intx*intx + inty*inty);

    //Initalize values
    var dist = 0;
    var x = physical.location.x;
    var y = physical.location.y;
    var end = 400/gridsize;

    while (dist < end){
      if (world.get(x, y) == true){
        callback(dist*gridsize);
        return;
      }

      dist += intDist;
      x += intx;
      y += inty;
    }

    callback(null);
  },
  rotateProbe: function(value, callback){
    physical.probeRot = (physical.probeRot+value) % (Math.PI*2);
    callback();
  }
}