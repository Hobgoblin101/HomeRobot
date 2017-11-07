var NArray = require('./NArray.js');

module.exports = function(){
  this._ = new NArray();
  this.minX = 0;
  this.minY = 0;
  this.maxX = 0;
  this.maxY = 0;
};
module.exports.prototype.get = function(x, y){
  if (this._.get(x) instanceof NArray){
    return this._.get(x).get(y);
  }

  return undefined;
};
module.exports.prototype.set = function(x, y, value){
  this.minX = Math.min(this.minX, x);
  this.minY = Math.min(this.minY, y);
  this.maxX = Math.min(this.maxX, x);
  this.maxY = Math.min(this.maxY, y);

  if (!(this._.get(x) instanceof NArray)){
    this._.set(x, new NArray());
  }

  this._.get(x).set(y, value);

  return value;
};
module.exports.prototype.forEach = function(callback){
  this._.forEach(function(xvalue, x){
    xvalue.forEach(function(yvalue, y){
      callback(yvalue, x, y);
    });
  });
};
