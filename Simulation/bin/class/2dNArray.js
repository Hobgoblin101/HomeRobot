class NArray2D{
  constructor(){
    this._ = new NArray();
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
  }

  get(x, y){
    if (this._.get(x) instanceof NArray){
      return this._.get(x).get(y);
    }

    return undefined;
  }

  set(x, y, value){
    if (x > this.maxX){
      this.maxX = x;
    }else if (x < this.minX){
      this.minX = x;
    }
    if (y > this.maxY){
      this.maxY = y;
    }else if (y < this.minY){
      this.minY = y;
    }

    if (!(this._.get(x) instanceof NArray)){
      this._.set(x, new NArray());
    }

    this._.get(x).set(y, value);

    return value;
  }

  forEach(callback){
    this._.forEach(function(xvalue, x){
      xvalue.forEach(function(yvalue, y){
        callback(yvalue, x, y);
      });
    });
  }
}
