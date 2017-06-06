class Robot{
  constructor(){
    this.loc = new Vector2();
    this.rotation = new Rotation();

    this.stepperMotor = {
      steps: 0,
      maxSteps: 15,
      rotation: new Rotation(0)
    };

    this.recentProbs = [];
  }

  update(probDist){
    //Add distance
    var point = new Vector2(0, probDist);
    point.rotation = this.stepperMotor.rotation;
    this.recentProbs.unshift(point);

    this.recentProbs.splice(this.stepperMotor.maxSteps);

    //Rotate Prob
    this.stepperMotor.steps = (this.stepperMotor.steps+1) % this.stepperMotor.maxSteps;
    this.stepperMotor.rotation.degrees = 360 * (this.stepperMotor.steps / this.stepperMotor.maxSteps);
  }

  draw(){
    push();
    fill(150);

    translate(this.loc.x, this.loc.y);
    rotate(this.rotation.radians);

    for (let i=0; i<this.recentProbs.length; i++){
      if (!(this.recentProbs[i] instanceof Vector2)){
        continue;
      }

      stroke(255-i, 0,0);

      line(0,0, this.recentProbs[i].x, this.recentProbs[i].y);
      noStroke();
      // ellipse(this.recentProbs[i].x, this.recentProbs[i].y, 10, 10);
    }

    //Draw robot
    ellipse(0, 0, 20, 20);
    stroke(100);
    line(0,0,0,10);

    pop();

    // this.move(0.01);
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

  function UltraSonicLoop(){
    var dist = DistanceProb(robot.loc, robot.stepperMotor.rotation);

    setTimeout(function () {
      robot.update(dist);
      UltraSonicLoop();
    }, (dist*2 / 34029000)); //Distance = Speed Of Sound * Time Taken / 2
  }

  UltraSonicLoop();
}, 1000);
