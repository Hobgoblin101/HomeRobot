var robot = {
  inLoop: false,
  fistScan: true,
  learning: true,

  confidence: 0,

  location: {
    known: new Vector2(),
    est: new Vector2()
  },
  angle: {
    known: 0,
    est: 0
  },
  probeRot: 0,
  mapping: {
    lastScanned: new NArray2D(),
    known: new NArray2D(),
    scanned: new NArray2D()
  },

  loop: function(){
    inLoop = true;

    physical.rotateProbe(Math.PI/20, function(){
      robot.probeRot += Math.PI/20;

      physical.probe(function(dist){
        //Fail probe
        if (dist == null){
          return;
        }
        var x = Math.trunc(Math.cos(robot.probeRot) * dist / gridsize);
        var y = Math.trunc(Math.sin(robot.probeRot) * dist / gridsize);


        robot.mapping.scanned.set(x, y, true);

        inLoop = false;
      });

      //If a full scan is complete, then run prediction algorithum
      if (robot.probeRot > Math.PI*2){
        robot.probeRot -= Math.PI*2;

        robot.predict();
      }
    });

    draw(); //FOR SIMULATION PURPOSES ONLY
  },
  predict: function(){
    if (robot.firstScan){
      robot.mapping.scanned.forEach(function(x, y, value){
        if (value == true){
          robot.fistScan = false;
          robot.mapping.known.set(x, y, true);
        }
      });
    }

    //Predict location
    var bestX = 0;
    var bestY = 0;
    var bestErr = 1;
    Spiral(20, function(x, y){
      var err = robot.guessLocation(robot.location.known.x+x, robot.location.known.y+y);
      if (err < bestErr){
        bestErr = err;
        bestX = x;
        bestY = y;
      }
    });
    robot.location.est.x = robot.location.known.x + bestX;
    robot.location.est.y = robot.location.known.y + bestY;
    robot.confidence = 1-bestErr;
    if (robot.confidence > 0.4){
      robot.location.known.x = robot.location.est.x;
      robot.location.known.y = robot.location.est.y;
    }

    // Learning
    if (robot.confidence >= 0.70 && robot.learning){
      console.log('learning');
      robot.mapping.scanned.forEach(function(x, y, value){
        if (value === true){
          robot.mapping.known.set(
            x+robot.location.known.x-bestX,
            y+robot.location.known.y-bestY,
            true
          );
        }else if (robot.confidence > 0.8){
          robot.mapping.known.set(
            x+robot.location.known.x-bestX,
            y+robot.location.known.y-bestY,
            false
          );
        }
      });
    }

    //Reset
    robot.mapping.lastScanned.forEach(function(x, y, value){
      robot.mapping.lastScanned.set(x, y, false);
    });
    robot.mapping.scanned.forEach(function(x, y, value){
      robot.mapping.lastScanned.set(x, y, value);
      robot.mapping.scanned.set(x, y, false);
    });
  },

  
  guessLocation: function(xoff, yoff){
    var total = 0;
    var tally = 0;

    robot.mapping.scanned.forEach(function(x, y, value){
      if (value === true){
        total += 1;
        if (robot.mapping.known.get(x+xoff, y+yoff) !== true){
          tally += 1;
        }
      }
    });

    return (tally/total);
  },
  guessRotation: function(){
    return 0;
  },
}

setInterval(function(){
  if (!robot.inLoop){
    robot.loop();
  }
}, 10);


function Spiral(range, callback){
  var x=0;
  var y=0;
  var dx = 0;
  var dy = -1;
  var searchSize = range**2;

  for (let i=0; i<range; i++){
    if ((-searchSize/2 < x && x < searchSize/2) && (-searchSize/2 < y && y < searchSize/2)){
      if (callback(x,y) === false){
        return;
      }
    }
    if (x === y || (x < 0 && x == -y) || (x > 0 && x == 1-y)){
      var t = dx; //Temp
      dx = -dy;
      dy = t;
    }
    x += dx;
    y += dy;
  }
}