/*--------------------------------------------------------------
    Create Basic room for testing
--------------------------------------------------------------*/

//Add Walls
for (let i=-24; i<=24; i++){
  world.set(24, i, true);
  world.set(-24, i, true);

  world.set(i, 24, true);
  // world.set(i, -24, true);
}

//Coffe table
world.set(4, 6, true);
world.set(-4, 6, true);
world.set(-4, -6, true);
world.set(4, -6, true);

//Lamp
world.set(-20, -20, true);
world.set(-19, -20, true);
world.set(-18, -20, true);
world.set(-22, -20, true);

world.set(-20, -22, true);
world.set(-20, -18, true);

world.set(-21, -20, true);
world.set(-20, -19, true);
world.set(-20, -21, true);
