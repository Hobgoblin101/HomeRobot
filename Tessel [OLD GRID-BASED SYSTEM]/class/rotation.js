module.exports = function(radians){
  this.radians = radians % Math.PI*2;
};
module.exports.prototype.cap = function(){
  this.radians = radians % Math.PI*2;
};
module.exports.prototype.getDegrees = function(){
  return this.radians * (180 / Math.PI);
};
module.exports.prototype.setDegrees = function(degrees){
  this.radians = degrees * (Math.PI / 180);
  this.cap();
  return this;
};
