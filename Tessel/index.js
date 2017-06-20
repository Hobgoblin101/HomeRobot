//Import classes
// var tessel = require('tessel');
var NArray = require('./class/NArray.js');
var NArray2D = require('./class/NArray2D.js');
var Vector2 = require('./class/vector2.js');

var world = require('./simulation/world.js');
var gridSize = 10;

var Ultrasonic = require('./components/ultrasonic.js');


setTimeout(function () {
  Ultrasonic.probe(function(dist){
    console.log(dist);

    Ultrasonic.probe(function(dist){
      console.log(dist);
    });
  });
}, 10);
