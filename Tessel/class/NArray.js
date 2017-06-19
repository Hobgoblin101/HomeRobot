module.exports = function(){
  this._ = [];
  this.min = 0;
  this.max = 0;
};
module.exports.prototype.get = function(index){
  index = Math.round(index);

  if (index < 0){
    return this._[index*2 + 1];
  }else{
    return this._[index*2];
  }
};
module.exports.prototype.set = function(index, value){
  index = Math.round(index);

  this.min = Math.min(this.min, index);
  this.max = Math.min(this.max, index);

  var i = index*2;

  if (index < 0){
    i = Math.abs(i) + 1;
  }

  this._[i] = value;
  return this._[i];
};
module.exports.prototype.forEach = function(callback){
  for (let i=0; i<this._.length; i++){
    if (this._[i] === undefined){
      continue;
    }

    var ti = i;
    if (ti % 2 !== 0){
      ti = (ti-1) * -1;
    }
    ti /= 2;

    callback(this._[i], ti);
  }
};
