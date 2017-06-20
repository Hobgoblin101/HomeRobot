class Robot{
  constructor(){
    //For simulation purposes only!!!
    this.loc = new Vector2();
    this.rotation = new Rotation();

    this.offset = new Vector2();
    this.confedence = 0;

    this.autoCal = {
      position: false,
      rotation: true
    };
    this.rotationDetail = 10;

    //Lay of the land knowledge
    this.hits = new NArray2D();
    this.memory = new NArray2D();
    this.learning = false;

    //Recorded stepperMotor position
    this.stepperMotor = {
      steps: 0,
      maxSteps: 45, // Min 16
      rotation: new Rotation(0)
    };

    this.recentProbes = [];
  }

  memorize(){
    console.log('learning...');

    for (let item of this.recentProbes){
      var rot = item.rotation.radians;
      var magnitude = Math.floor(item.magnitude);

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
      x: 0,                                 //World x location
      y: 0,                                 //World y location
      p: 0,                                 //Matching Percent
      n: 1                             //Number of equal bests
    };

    var offx = self.offset.x / gridSize;
    var offy = self.offset.y / gridSize;
    var sr = Math.max(                         //Search radius
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
        // best.x = (best.x*best.n) + ( cordinateX *(best.n+1) );
        // best.y = (best.y*best.n) + ( cordinateY *(best.n+1) );
        // best.n += 1;
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

  calculateRotation(){
    var best = {
      r: 0,                                                           //Rotation
      p: 0                                                    //Matching Percent
    };

    var sr = Math.max(                         //Search radius
      Math.max(
        Math.abs(this.memory.minX), Math.abs(this.memory.maxX)
      ),
      Math.max(
        Math.abs(this.memory.minY), Math.abs(this.memory.maxY)
      )
    );

    for (let i=0; i<this.rotationDetail; i++){
      var r = i * (Math.PI*2 / this.rotationDetail);

      var p = this.matchGridRotation(r);
    }

    // best.r = Math.round((best.r / this.rotationDetail)) * this.rotationDetail;

    console.log(best.r, p);
  }
  matchGridRotation(radians){
    var offx = this.offset.x / gridSize;
    var offy = this.offset.y / gridSize;

    var total = 0;
    var correct = 0;

    var self = this;

    self.hits.forEach(function(value, x, y){
      var mag = Math.sqrt(x*x + y*y);

      //Rotated x,y value
      var rx = radians === 0 || radians === Math.PI || radians === Math.PI*2 ? 0 : Math.sin(radians) * mag;
      var ry = radians === Math.PI/2 || radians === Math.PI*1.5 ? 0 : Math.cos(radians) * mag;

      if ((self.memory.get(rx + offx, ry + offy) === true) === (value === true)){
        correct += 1;
      }
      total += 1;
    });

    return (correct / total);
  }

  update(){
    var self = this;

    sensor.real.rot.degrees = robot.stepperMotor.rotation.degrees + this.rotation.degrees;

    sensor.probe(function(probeDist){
      //Add distance
      var point = new Vector2(0, probeDist);
      point.rotation = self.stepperMotor.rotation;
      self.recentProbes.unshift(point);

      self.recentProbes.splice(self.stepperMotor.maxSteps);

      //Rotate Probe
      self.stepperMotor.steps = (self.stepperMotor.steps+1) % self.stepperMotor.maxSteps;
      self.stepperMotor.rotation.degrees = 360 * (self.stepperMotor.steps / self.stepperMotor.maxSteps);

      if (self.stepperMotor.steps === 0){
        if (self.autoCal.position){
          self.calculateOffset();
        }

        if (self.autoCal.rotation){
          self.calculateRotation();
        }

        if (self.learning && (self.confedence > 0.9 || self.confedence === 0)){
          self.memorize();
        }

        self.hits.forEach(function(value, x, y){
          self.hits.set(x, y, false);
        });
        for (let item of self.recentProbes){
          self.hits.set(item.x/gridSize, item.y/gridSize, true);
        }
      }

      setTimeout(function () {
        self.update();
      }, 10);
    });
  }

  draw(){
    push();

    translate(this.loc.x, this.loc.y);
    rotate(this.rotation.radians);

    for (let i=0; i<this.recentProbes.length; i++){
      if (!(this.recentProbes[i] instanceof Vector2)){
        continue;
      }

      stroke(255*(1-i/this.recentProbes.length), 0,0);

      line(0,0, this.recentProbes[i].x, this.recentProbes[i].y);
      noStroke();
    }

    //Draw known probes
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

var sensor = new Ultrasonic();
var robot = new Robot();
sensor.real.loc = robot.loc;
// sensor.real.rot = robot.stepperMotor.rotation;

robot.memory = world;

robot.update();
