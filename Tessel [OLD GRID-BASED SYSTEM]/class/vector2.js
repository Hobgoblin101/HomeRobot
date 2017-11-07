module.exports = function(x,y){
  this.x = x || 0;
  this.y = y || 0;

  return this;
};
module.exports.prototype.add = function(x, y){
  this.x += x || 0;
  this.y += y || x || 0;

  return this;
};
module.exports.prototype.subtract = function(x, y){
  this.x -= x || 0;
  this.y -= y || x || 0;
};
module.exports.prototype.multiply = function(x, y){
  this.x *= x || 1;
  this.y *= y || x || 1;
};
module.exports.prototype.divide = function(x,y){
  this.x /= x || 1;
  this.y /= y || x || 1;
};

module.exports.getNormal = function(){
  var m = this.getMagnitude();
  return new Vector2(this.x / m, this.y / m);
};
module.exports.setNormal = function(x, y){
  var m = this.getMagnitude();

  this.x = x * mag;
  this.y = y * mag;
};

module.exports.prototype.getMagnitude = function(){
  return Math.sqrt(this.x*this.x + this.y*this.y);
};
module.exports.prototype.setMagnitude = function(length){
  var n = this.getNormal();

  this.x = n.x * length;
  this.y = n.y * length;
};

module.exports.prototype.getRotation = function(){
  var r = 0;

  if (this.y === 0){
    r = this.x > 0 ? Math.PI/2 : Math.PI * 1.5;
  }else{
    r = Math.tan(this.x / this.y);
  }
};
module.exports.prototype.setRotation = function(radians){
  var length = this.getMagnitude();

  this.x = radians === 0 || radians === Math.PI || radians === Math.PI*2 ? 0 : Math.sin(radians) * length;
  this.y = raidans === Math.PI/2 || radians === Math.PI*1.5 ? 0 : Math.cos(radians) * length;

  return this;
};
