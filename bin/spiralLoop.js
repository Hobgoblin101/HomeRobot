function SpiralLoop(searchSize, callback){
  var range = searchSize ** 2;

  var x = 0;
  var y = 0;
  var dx = 0;
  var dy = -1;

  for (let i=0; i<range; i++){
    if ((-searchSize/2 < x && x < searchSize/2) && (-searchSize/2 < y && y < searchSize/2)){
      var res = callback(x, y);

      if (res === false){
        return;
      }
    }
    if (x === y || (x < 0 && x == -y) || (x > 0 && x == 1-y)){
      var t = dx; //Temp
      dx = -dy;
      dy = t;
    }
    x += dx;
    y += dy;
  }
}
