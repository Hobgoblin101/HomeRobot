class NArray2D{
  constructor(){
    this._ = new NArray();
  }

  get(x, y){
    if (this._.get(x) instanceof NArray){
      return this._.get(x).get(y);
    }

    return undefined;
  }

  set(x, y, value){
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
