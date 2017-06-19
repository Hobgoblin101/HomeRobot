//Import classes
// var tessel = require('tessel');
var NArray = require('./class/NArray.js');
var NArray2D = require('./class/NArray2D.js');
var Rotation = require('./class/Rotation.js');
var Vector2 = require('./class/Vector2.js');

var test = new NArray2D();
test.set(24, -24, true);

var world = require('./simulation/world.js');
//
// var Ultrasonic = require('./components/Ultrasonic.js');
//
//
// Ultrasonic.probe(function(dist){
//   console.log(dist);
// });
