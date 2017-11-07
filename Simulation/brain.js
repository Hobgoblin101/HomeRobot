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

    physical.rotateProbe(Math.PI/20, function(dist){
      robot.probeRot += Math.PI/20;

      physical.probe(function(dist){
        //Fail probe
        if (isNaN(dist))  {
          robot.inLoop = false;
          return;
        }
        var x = Math.trunc((Math.cos(robot.probeRot) * dist) / gridsize);
        var y = Math.trunc((Math.sin(robot.probeRot) * dist) / gridsize);

        if (x == 0 || y == 0){
          robot.inLoop = false;
          return;
        }

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
    var avgOffx = 0;                                  //Average offset
    var avgOffy = 0;
    var offs = [];                             //List of offset values
    for (let i=0; i<robot.mapping.lastScanned.length; i++){
      var px = robot.mapping.lastScanned[i].x + robot.location.known.x;
      var py = robot.mapping.lastScanned[i].y + robot.location.known.y;

      var t = NearestPoint(robot.mapping.known, {x: px, y: py});
      avgOffx += (t.x - px); //Add error
      avgOffy += (t.y - py);
      offs.push({
        x: (t.x - px),
        y: (t.y - py)
      });
    }
    avgOffx /= robot.mapping.lastScanned.length;
    avgOffy /= robot.mapping.lastScanned.length;

    //Remove possible new points from the average
    var dOffx;                                          //Delta offset
    var dOffy;
    var offx = 0;                            //Relevent average offset
    var offy = 0;
    var offTally = 0;
    for (let i=0; i<offs.length; i++){
      dOffx = offs[i].x - avgOffx;
      dOffy = offs[i].y - avgOffy;

      // console.log(offs[i], avgOffx, avgOffy);
      

      if (Math.abs(dOffx) > 20){
        continue;
      }else if (Math.abs(dOffy) > 20){
        continue;
      }

      offx += offs[i].x;
      offy += offs[i].y;
      offTally += 1;
    }
    offx /= offTally;
    offy /= offTally;

    robot.location.known.x += Math.max(-10, Math.min(10, offx));
    robot.location.known.y += Math.max(-10, Math.min(10, offy));
  }
}

//Let the AI start knowing the interworld
robot.firstScan = false;
world.forEach(function(x, y, value){
  if (value === true){
    robot.mapping.known.push(new Vector2(x, y));
  }
});

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