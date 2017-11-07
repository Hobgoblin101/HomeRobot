class Vector2{
  constructor(x, y){
    this.x = x || 0;
    this.y = y || 0;
  }

  clone(){
    return new Vector2(this.x, this.y);
  }
}