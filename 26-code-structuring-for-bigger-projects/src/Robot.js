// How classes work with a simple example. This file is not related to the project.

// 1. Define a class called "Robot".
//    A class is like a blueprint or design plan.
//    It tells JavaScript how to create Robot objects (what they can have or do).
class Robot {
  constructor(name, legs) {
    this.name = name;
    this.legs = legs;
    console.log(`I am ${name}. Thank you Laleh.`)
  }
}

// 2. Create instances of the Robot class.
//    These are actual robot objects made from the Robot blueprint.
//    Each instance now has its own properties like name, color, and size.
// const walle = new Robot('WALL·E', 0, )
// const ultron = new Robot('Ultron', 2, )
// const astrobot = new Robot('AstroBot', 2, ) 

// When a class instantiated using new, the constructor method is called automatically and immediately.


export default Robot