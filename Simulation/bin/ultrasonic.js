class Ultrasonic{
  constructor(port){
    this.port = port || 'A';
    this.last = 450;

    //For simulation purposes
    this.real = {
      loc: new Vector2(0, 0),
      rot: new Rotation(0)
    };
  }

  probe(callback){
    var start = Date.now();

    var r = this.real.rot.radians;
    var offx = this.real.loc.x / gridSize;
    var offy = this.real.loc.y / gridSize;


    var point = new Vector2(0,1);
    point.rotation = r;

    var dist;
    var length = 450 / gridSize;

    for (let i=0; i<length; i++){
      var x = Math.sin(r) * i;
      var y = Math.cos(r) * i;

      var hit = world.get(
        x + offx,
        y + offy
      );

      if (hit){
        dist = Math.sqrt(x*x + y*y) * gridSize;
        break;
      }
    }

    if (!dist){
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
  }
}
