class Vector2{
  constructor(x, y){
    this.x = x || 0;
    this.y = y || 0;

    return this;
  }

  add(x, y){
    this.x += x || 0;
    this.y += y || x || 0;

    return this;
  }
  subtract(x, y){
    this.x -= x || 0;
    this.y -= y || x || 0;

    return this;
  }
  multiply(x, y){
    this.x *= x || 1;
    this.y *= y || x || 1;

    return this;
  }

  get rotation(){
    var r = new Rotation(0);

    if (this.y === 0){
      r.degrees = this.x > 0 ? 90 : 270;
    }else{
      r.radians = Math.tan(this.x / this.y);
    }

    return r;
  }
  set rotation(angle){
    var length = Number(this.magnitude);

    this.x = angle.degrees === 180 || angle.degrees === 0 || angle.degrees === 360 ? 0 : Math.sin(angle.radians) * length;
    this.y = angle.degrees === 90 || angle.degrees === 270 ? 0 : Math.cos(angle.radians) * length;

    return this;
  }

  get magnitude(){
    return Math.sqrt( Math.pow(this.x, 2) + Math.pow(this.y, 2) );
  }
  set magnitude(scalar = 1){
    var n = this.normal;

    this.x = n.x * scalar;
    this.y = n.y * scalar;
  }

  get normal(){
    return new Vector2(this.x/this.magnitude, this.y/this.magnitude);
  }
  set normal(vector){
    var mag = this.magnitude;

    this.x = vector.x * mag;
    this.y = vector.y * mag;
  }
}

var test = new Vector2(0, 10);
console.log('rot', test.rotation);
test.rotation = new Rotation(90);
console.log(test);
