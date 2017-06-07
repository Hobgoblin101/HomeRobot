class Robot{
  constructor(){
    //For simulation purposes only!!!
    this.loc = new Vector2();
    this.rotation = new Rotation();

    this.offset = new Vector2();
    this.confedence = 0;

    //Lay of the land knowledge
    this.hits = new NArray2D();
    this.memory = new NArray2D();
    this.learning = true;

    //Recorded stepperMotor position
    this.stepperMotor = {
      steps: 0,
      maxSteps: 360, // Min 16
      rotation: new Rotation(0)
    };

    this.recentProbs = [];
  }

  memorize(){
    console.log('learning...');

    for (let item of this.recentProbs){
      var rot = item.rotation.radians;
      var magnitude = Math.floor(item.magnitude);

      // console.log('setting...', rot, magitude);

      for (let i=0; i<magnitude; i++){
        var x = (this.offset.x + Math.sin(rot)*i) / gridSize;
        var y = (this.offset.y + Math.cos(rot)*i) / gridSize;

        this.memory.set(x, y, false);
      }
      this.memory.set(
        (item.x+this.offset.x) / gridSize,
        (item.y+this.offset.y) / gridSize,
        true
      );
    }
  }

  calculateOffset(){
    var self = this;
    var best = {
      x: 0,
      y: 0,
      p: 0,
      n: 1 //Number of equal bests
    };

    var offx = self.offset.x / gridSize;
    var offy = self.offset.y / gridSize;
    var sr = Math.max(
      Math.max(
        Math.abs(this.memory.minX), Math.abs(this.memory.maxX)
      ),
      Math.max(
        Math.abs(this.memory.minY), Math.abs(this.memory.maxY)
      )
    );

    SpiralLoop(sr, function(x, y){
      var cordinateX = x + offx;
      var cordinateY = y + offy;

      var p = self.matchGridOffset(cordinateX, cordinateY);

      if (p > best.p){
        best.x = cordinateX;
        best.y = cordinateY;
        best.p = p;
        best.n = 1;
      }else if (best.p !== 0 && best.p === p){
        //If equal best, add to the average
        best.x = (best.x*best.n) + ( cordinateX *(best.n+1) );
        best.y = (best.y*best.n) + ( cordinateY *(best.n+1) );
        best.n += 1;
      }

      //Break down after distances so that the robot will pick the best option, but after it has done allot of calculation it slowly becomes less and less nit picky until it gives up
      var radius = Math.max(Math.abs(x), Math.abs(y));
      if (radius > 3){
        if (1-((radius-3)/30) < best.p){
          return false;
        }
      }
    });

    if (best.p >= 0.25){
      if (best.x === Infinity || best.y === Infinity){
        this.confedence = 0;
      }else{
        this.offset.x = best.x * gridSize;
        this.offset.y = best.y * gridSize;
        this.confedence = best.p;
      }
    }

    return best.p;
  }
  matchGridOffset(cordX, cordY){
    var total = 0;
    var correct = 0;
    // var wrong = 0;

    var self = this;

    self.hits.forEach(function(value, x, y){
      if ((self.memory.get(x + cordX, y + cordY) === true) === (value === true)){
        correct += 1;
      }
      total += 1;
    });

    return (correct / total);
  }

  update(probDist){
    if (Math.abs(this.offset.x) === Infinity || Math.abs(this.offset.y) === Infinity){
      this.offset.x = 0;
      this.offset.y = 0;
      this.confedence = 0;
    }

    var self = this;

    //Add distance
    var point = new Vector2(0, probDist);
    point.rotation = this.stepperMotor.rotation;
    this.recentProbs.unshift(point);

    this.recentProbs.splice(this.stepperMotor.maxSteps);

    //Rotate Prob
    this.stepperMotor.steps = (this.stepperMotor.steps+1) % this.stepperMotor.maxSteps;
    this.stepperMotor.rotation.degrees = 360 * (this.stepperMotor.steps / this.stepperMotor.maxSteps);

    if (this.stepperMotor.steps === 0){
      this.calculateOffset();

      if (this.learning && (this.confedence > 0.9 || this.confedence === 0)){
        this.memorize();
      }

      this.hits.forEach(function(value, x, y){
        self.hits.set(x, y, false);
      });
      for (let item of this.recentProbs){
        this.hits.set(item.x/gridSize, item.y/gridSize, true);
      }
    }
  }

  draw(){
    push();

    translate(this.loc.x, this.loc.y);
    rotate(this.rotation.radians);

    for (let i=0; i<this.recentProbs.length; i++){
      if (!(this.recentProbs[i] instanceof Vector2)){
        continue;
      }

      stroke(255*(1-i/this.recentProbs.length), 0,0);

      // line(0,0, this.recentProbs[i].x, this.recentProbs[i].y);
      noStroke();
    }

    //Draw known probs
    fill(0, 255, 0, 120);
    this.hits.forEach(function(value, x, y){
      if (value){
        rect(
          x*gridSize - gridSize/2,
          y*gridSize - gridSize/2,
          gridSize,
          gridSize
        );
      }
    });


    //Draw robot
    fill(150);
    ellipse(0, 0, 20, 20);
    stroke(100);
    line(0,0,0,10);

    pop();

    //Draw robot estimated location
    fill(0, 255, 0, 100);
    ellipse(this.offset.x, this.offset.y, 10, 10);

    //Draw Memory
    fill(0, 0, 255, 50);
    this.memory.forEach(function(value, x, y){
      if (value){
        rect(
          x*gridSize - gridSize/2,
          y*gridSize - gridSize/2,
          gridSize,
          gridSize
        );
      }
    });
  }

  move(dist){
    var amount = new Vector2(0, 1);
    amount.rotation = this.rotation;
    amount.magitude = dist;
    this.loc.add(amount.x, amount.y);

    return this;
  }
}

var robot = new Robot();





setTimeout(function(){
  //speedOfSound 340.29   m/s
  //             34029000 cm/ms

  // robot.memory = world;

  function UltraSonicLoop(){
    var dist = DistanceProb(robot.loc, robot.stepperMotor.rotation);

    setTimeout(function () {
      robot.update(dist);
      UltraSonicLoop();
    }, (dist*2 / 34029000)); //Distance = Speed Of Sound * Time Taken / 2
  }

  UltraSonicLoop();
}, 1);
