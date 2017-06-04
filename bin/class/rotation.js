class Rotation{
  constructor(degrees = 0){
    if (typeof degrees == "object"){
      if (degrees._){
        degrees = degrees._;
      }else{
        degrees = 0;
      }
    }

    this._ = degrees;
  }

  get degrees(){
    return this._;
  }
  set degrees(input = this._){
    this._ = input;
    this.cap();

    return this.degrees;
  }

  get radians(){
    return this.degrees * (Math.PI/180);
  }
  set radians(input){
    this._ = input / (Math.PI/180);
    this.cap();
    return;
  }

  cap(){
    this._ = this._ % 360;
    if (this._<0){
      this._ += 360;
    }

    return this;
  }
}
