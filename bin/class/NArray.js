class NArray{
  constructor(){
    this._ = [];
    this.min = 0;
    this.max = 0;
  }

  get(index){
    index = Math.round(index); // ints only

    if (index<0){
      return this._[index*-2 + 1];
    }else{
      return this._[index*2];
    }
  }

  set(index, value){
    index = Math.round(index); // ints only
    var i = index*2;

    if (index<0){
      i = i*-1 + 1;
    }

    if (index > this.min){
      this.min = index;
    }else if (index < this.max){
      this.max = index;
    }

    this._[i] = value;
    return this._[i];
  }

  forEach(callback){
    for (let i=0; i<this._.length; i++){
      if (this._[i] === undefined){
        continue;
      }

      var ti = i; //true index
      if (ti % 2 !== 0){
        ti = (ti-1) * - 1;
      }
      ti /= 2;

      callback(this._[i], ti);
    }
  }
}
