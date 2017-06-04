class Robot{
  constructor(){
    this.loc = new Vector2();
    this.rotation = new Rotation();

    this.stepperMotor = {
      steps: 0,
      maxSteps: 20,
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

    //Draw robot
    ellipse(0, 0, 20, 20);
    stroke(100);
    line(0,0,0,10);

    for (let i=0; i<this.recentProbs.length; i++){
      if (!(this.recentProbs[i] instanceof Vector2)){
        continue;
      }

      if (i===0){
        fill(0,255,0);
      }else{
        fill(0,0,255);
      }

      stroke(255,0,0);
      line(0,0, this.recentProbs[i].x, this.recentProbs[i].y);
      noStroke();
      ellipse(this.recentProbs[i].x, this.recentProbs[i].y, 10, 10);

      console.log('drew prob at', this.recentProbs[i].x, this.recentProbs[i].y);
    }

    pop();
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
  //speedOfSound 340.29 m/s

  function UltraSonicLoop(){
    var dist = DistanceProb(robot.loc, robot.stepperMotor.rotation);

    setTimeout(function () {
      robot.update(dist);
      UltraSonicLoop();
    }, (dist*2 / 340.29)*1000); //Distance = Speed Of Sound * Time Taken / 2
  }

  UltraSonicLoop();
}, 1000);
