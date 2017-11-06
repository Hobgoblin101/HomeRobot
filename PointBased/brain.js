var robot = {
  inLoop: false,
  firstScan: true,
  learning: false,

  confidence: 0,
  probeRot: 0,

  location: {
    est: new Vector2(),
    known: new Vector2(),
  },
  rotation: {
    known: 0,
    est: 0
  },
  mapping: {
    lastScanned: [],
    known: [],
    scanned: [],
  },

  loop: function(){
    robot.inLoop = true;

    physical.rotateProbe(Math.PI/10, function(dist){
      robot.probeRot += Math.PI/10;

      physical.probe(function(dist){
        //Fail probe
        if (dist == null)  {
          robot.inLoop = false;
          return;
        }
        var x = Math.trunc((Math.cos(robot.probeRot) * dist) / gridsize);
        var y = Math.trunc((Math.sin(robot.probeRot) * dist) / gridsize);

        robot.mapping.scanned.push(new Vector2(x, y));

        robot.inLoop = false;
      });
    });

    if (robot.probeRot > Math.PI*2){
      robot.probeRot -= Math.PI*2;
      robot.predict();
    }

    //FOR SIMULATION PURPOSES ONLY
    draw();
  },

  predict: function(){
    //Move the scan to a different object for processing, and purge previouse data
    robot.mapping.lastScanned = [].concat(robot.mapping.scanned);
    robot.mapping.scanned = [];

    //Allow the robot to get it's first reference points
    if (robot.firstScan){
      robot.firstScan = false;
      robot.mapping.known = [].concat(robot.mapping.lastScanned);
      return;
    }

    //Detect average point offset
    var xoff = 0;
    var yoff = 0;
    for (let i=0; i<robot.mapping.lastScanned.length; i++){
      var t = NearestPoint(robot.mapping.known, robot.mapping.lastScanned[i]);
      xoff += t.x;
      yoff += t.y;
    }
    xoff /= robot.mapping.lastScanned.length;
    yoff /= robot.mapping.lastScanned.length;

    console.log(xoff, yoff);

    // console.log(NearestPoint(robot.mapping.known, robot.mapping.known[0]));
  }
}

setInterval(function(){
  if (!robot.inLoop){
    robot.loop();
  }
}, 100);

function NearestPoint(pointArray, point){
  if (!pointArray[0] || !pointArray[0].x){
    return 0;
  }
  
  var bestPoint = 0;
  var dx = pointArray[0].x - point.x;
  var dy = pointArray[0].y - point.y;
  var dist = dx*dx + dy*dy;
  var d = 0;
  for (let i=1; i<pointArray.length; i++){
    dx = pointArray[i].x - point.x;
    dy = pointArray[i].y - point.y;

    if (dx === 0 && dy === 0){
      return new Vector2(pointArray[i].x, pointArray[i].y);
    }

    d = dx*dx + dy*dy;

    if (d < dist){
      dist = d;
      bestPoint = i;
    }
  }

  return new Vector2(pointArray[bestPoint].x, pointArray[bestPoint].y);
}