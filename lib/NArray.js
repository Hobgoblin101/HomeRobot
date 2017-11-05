/**
 * A class to allow arrays with negative indexes
 */
class NArray{
  constructor(){
    this.elements = [];
  }

  /**
   * Get the element's property
   * @param {number} index 
   */
  get(index){
    index = Math.trunc(index) * 2;
    if (index < 0){
      index = (-index) - 1;
    }

    return this.elements[index];
  }

  /**
   * Set the element's property
   * @param {number} index 
   * @param {any} value 
   * @returns {any}
   */
  set(index, value){
    index = Math.trunc(index) * 2;
    if (index < 0){
      index = (-index) - 1;
    }

    this.elements[index] = value;
    return this;
  }

  /**
   * Loop through all elements running callback with negative index, element value
   * @param {function} callback 
   * @returns {null}
   */
  forEach(callback){
    var i=0;
    for (let j=0; j<this.elements.length; j++){
      if (j % 2 == 0){
        i = j / 2;
      }else{
        i = -(j + 1) / 2;
      }

      callback(i, this.elements[j]);
    }
  }
}

/**
 * A class to allow for a 2D array which is negative index inclusive
 */
class NArray2D{
  constructor(){
    this.elements = new NArray();
  }

  /**
   * Set element's value
   * @param {number} x 
   * @param {number} y 
   */
  get (x, y){
    var pointer = this.elements.get(x);
    if (pointer instanceof NArray){
      return pointer.get(y);
    }else{
      return undefined;
    }
  }

  /**
   * Set element's value
   * @param {number} x 
   * @param {number} y 
   * @param {any} value 
   */
  set (x, y, value){
    var pointer = this.elements.get(x);

    if (pointer instanceof NArray){
      return pointer.set(y, value);
    }else{
      return this.elements.set(x, new NArray().set(y, value));
    }
  }

  /**
   * Loop though each element running callback(x, y, value)
   * @param {function} callback 
   * @returns {null}
   */
  forEach(callback){
    this.elements.forEach(function(x, value){
      if (value instanceof NArray){
        value.forEach(function(y, value){
          callback(x, y, value);
        })
      }
    });
  }
}

// var test = new NArray();
// test.set(0,0, 0);
// test.set(1,1, 1);
// test.set(-1,-1, 2);
// test.forEach(function(x, y){
//   console.log(x, y);
// });