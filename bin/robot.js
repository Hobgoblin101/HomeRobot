class Robot{
  constructor(){
    //For simulation purposes only!!!
    this.loc = new Vector2();
    this.rotation = new Rotation();

    this.offset = new Vector2();

    //Lay of the land knowledge
    this.hits = new NArray2D();
    this.memory = new NArray2D();

    //Recorded stepperMotor position
    this.stepperMotor = {
      steps: 0,
      maxSteps: 360,
      rotation: new Rotation(0)
    };

    this.recentProbs = [];
  }

  calculateOffset(){
    var self = this;
    var best = {
      x: 0,
      y: 0,
      p: 0,
      n: 1 //Number of equal bests
    };

    SpiralLoop(9, function(x, y){
      var p = self.matchGridOffset(
        x + (self.offset.x/gridSize),
        y + (self.offset.y/gridSize)
      );

      if (p > best.p){
        best.x = x;
        best.y = y;
        best.p = p;
        best.n = 1;
      }else if (best.p !== 0 && best.p === p){
        //If equal best, add to the average
        best.x = best.x*best.n + x *(best.n+1);
        best.y = best.y*best.n + y *(best.n+1);
        best.n += 1;
      }
    });

    console.log(best);

    if (best.p >= 0.25){
      this.offset.x = best.x * gridSize;
      this.offset.y = best.y * gridSize;

      return best.p;
    }

    return best.p;
  }

  matchGridOffset(offx, offy){
    var total = 0;
    var correct = 0;

    var self = this;

    self.hits.forEach(function(value, x, y){
      total += 1;
      var t = self.memory.get(x + offx, y + offy);
      if (t !== undefined){
        if (t == value){
          correct += 1;
        }else{
          correct -= 1;
        }
      }
    });

    return correct / total;
  }

  update(probDist){
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

      this.hits.forEach(function(value, x, y){
        self.hits.set(x, y, false);
        // value = false;
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

      line(0,0, this.recentProbs[i].x, this.recentProbs[i].y);
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

  robot.memory = world;

  function UltraSonicLoop(){
    var dist = DistanceProb(robot.loc, robot.stepperMotor.rotation);

    setTimeout(function () {
      robot.update(dist);
      UltraSonicLoop();
    }, (dist*2 / 34029000)); //Distance = Speed Of Sound * Time Taken / 2
  }

  UltraSonicLoop();
}, 1);
