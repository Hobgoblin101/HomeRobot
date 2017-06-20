var Vector2 = require('.././class/vector2.js');

module.exports = {
  last: 0,
  real: {
    loc: new Vector2(0,0),
    rot: 0
  }
};

module.exports.probe = function(callback){
  var start = Date.now();

  var r = this.real.radians;
  var offx = this.real.loc.x / global.gridSize;
  var offy = this.real.loc.y / global.gridSize;


  var point = new Vector2(0,1);
  point.rotation = r;

  var dist;
  var length = 450 / global.gridSize;

  for (let i=0; i<length; i++){
    var x = Math.sin(r) * i;
    var y = Math.cos(r) * i;

    var hit = global.world.get(
      x + offx,
      y + offy
    );

    if (hit){
      dist = Math.sqrt(x*x + y*y) * global.gridSize;
      break;
    }
  }

  if (!dist){
    console.error('Invalid distance', dist);

    dist = 450;
  }

  var load = Date.now() - start;
  var time = dist*2 / 34029000;

  if (load > time){
    console.warn('Probe calculation took longer than actual action ('+ (load-time).toFixed(0) +'ms longer)');
    callback(dist);
  }else{
    setTimeout(function () {
      callback(dist);
    }, time-load);
  }
};
