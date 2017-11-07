var Ultrasonic = require('./components/ultrasonic.js');
var NArray2D = require('./class/NArray2D.js');
var Vector2 = require('./class/vector2.js');

var brain = {
  offset: new Vector2(0,0),
  rotation: 0,
  confedence: 0,

  hits: new NArray2D(),
  memory: new NArray2D(),
  learning: false,

  sensorMotor: null,
  sensor: new Ultrasonic(),

  recentProbes: []
};

module.exports = brain;
