class Motor{
  constructor(port){
    this.position = 0;
    this.rotation = new Rotation();
    this.port = port || 0;
  }

  goto(done){
    //Do stuff
    if (typeof(done) == "function"){
      done();
    }
  }
}
