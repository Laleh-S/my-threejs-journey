//? Go further with cannon.js:

// Constraints:
// As the name suggests, enable constraints between two bodies. We won't cover those in this lesson, but here's the list of constraints:
// - HingeConstraint: acts like a door hinge.
// - DistanceConstraint: forces the bodies to keep a distance between each other.
// - LockConstraint: merges the bodies like if they were one piece.
// - PointToPointConstraint: glues the bodies to a specific point.

//? Examples:
// cannon.js documentation isn't perfect. It would help to spent some time in the demos and research to find out how to do things. 
//🚫 CANNON.js demos:   https://schteppe.github.io/cannon.js/

// Cannon-es
// Cannon.js hasn't been updated for years. Fortunately, some guys forked the repository and started working on updates. Thanks to them, we have access to a better and maintained version of Cannon.js:
//🚫 Git repository:  https://github.com/pmndrs/cannon-es
//🚫 NPM page:   https://www.npmjs.com/package/cannon-es

//? Workers:
// Running the physics simulation takes time. The component of your computer doing the work is the CPU. When you run Three.js, Cannon.js, your code logic, etc. everything is done by the same thread in your CPU. That thread can quickly overload if there is too much to do (like too many objects in the physics simulation), resulting in a frame rate drop.
// The right solution is to use workers. Workers let you put a part of your code in a different thread to spread the load. You can then send and receive data from that code. It can result in a considerable performance improvement.
// The problem is that the code has to be distinctly separated. You can find a good and simple example here in the page source code: 
//  https://schteppe.github.io/cannon.js/examples/worker.html


//? Physijs: 
// Eases the implementation of physics in a Three.js project. It uses Ammo.js and supports workers natively.

// Website:  https://chandlerprall.github.io/Physijs/
// Git repository:  https://github.com/chandlerprall/Physijs
// Documentation:  https://github.com/chandlerprall/Physijs/wiki

// Instead of creating the Three.js object and the physics object, you create both simultaneously:

// box = new Physijs.BoxMesh(
//     new THREE.CubeGeometry(5, 5, 5),
//     new THREE.MeshBasicMaterial({ color: 0x888888 })
// )
// scene.add(box)

// Physijs will take care of the rest.
// While it's fascinating, especially for beginners, things get complicated when you try to do something not supported by the library. Finding where a bug comes from can also be a hassle.
// Like for Ammo.js, take your time and think about what is the best solution for your project.



//? 3D physics libraries:
// - Ammo.js:
// Website: http://schteppe.github.io/ammo.js-demos/

// - Cannon.js:
// Website: https://schteppe.github.io/cannon.js/

// - Oimo.js:
// Website: https://lo-th.github.io/Oimo.js/

// - Rapier
// Website: https://rapier.rs/


//? 2D physics libraries:
// - Matter.js
// Website: https://brm.io/matter-js/

// - P2.js
// Website: https://schteppe.github.io/p2.js/

// - Planck.js
// Website: https://piqnt.com/planck.js/

// - Box2D.js
// Website: http://kripken.github.io/box2d.js/demo/webgl/box2d.html


//? Article about how step timestep works!
// https://gafferongames.com/post/fix_your_timestep/



// 📌📌📌 NOTE:
// ===== CANNON.js:
//  is a 3D physics engineused in web-based 3D applications to simulate real-world physics like collisions, gravity, rigid body dynamics, and more.


// 📌📌📌 NOTE:
// ===== Math.PI Key Conversions:
//   Degrees: 	                   Radians:
// - Full rotation = 360°  ->      Math.PI * 2
// - Half rotation = 180°  ->      Math.PI
// - Quarter rotation = 90°   ->   Math.PI / 2
// - Eighth rotation = 45°   ->    Math.PI / 4


// 📌📌📌 NOTE:
// ===== Physics world: 
// Is purely theoretical — we cannot see it. But in this world, things fall, collide, rub, slide, and interact just like in real life.
// When we create a mesh in Three.js, we will also create a physics version of that mesh inside the physics world. For example, if we make a box in Three.js, we also create a box in the physics world.
// Then, on each frame, before rendering anything, we ask the physics world to update itself. After it simulates one step, we copy the new position and rotation of the physics bodies and apply them to the corresponding Three.js meshes.


// 📌📌📌 NOTE:
// ===== Animation section:
// What’s a Frame Loop?
// Imagine the computer screen is like a flipbook— a bunch of pictures that change really fast to look like movement.
// A frame is one picture.
// A frame loop is what flips through those pictures really fast, about 60 times every second!

// elapsedTime:
// This is like looking at your stopwatch and seeing how long the game has been running.
// "Oh! It’s been 10 seconds since we started!"

// oldElapseTime:
// This remembers the stopwatch time from the last picture (frame).
// "Last time I looked, it was 9.98 seconds."

// deltaTime:
// This is the difference between now and last time.
// So: "Now it’s 10 seconds, before it was 9.98 — that means 0.02 seconds passed!" That’s deltaTime.

// Why do we need all this?
// We use deltaTime to tell how much things should move or fall or spin since the last picture.
// If deltaTime is small, things move a little.
// If deltaTime is big (maybe your computer slowed down), things move more, so animation stays smooth.

// What does the tick function do?
// It's like a game helper that runs every time a new picture is shown:
// 1 - Checks the time
// 2 - Calculates how much time passed
// 3 - Moves stuff like balls or characters
// 4 - Updates the camera or controls
// 5 - Draws the next picture
// 6 - Says: "Okay! Do it again for the next picture!"


// 📌📌📌 NOTE:
// ===== How does " world.step(1 / 60, deltaTime, 3) " work?
// Imagine we're playing with a bouncy ball in slow motion and want to show how it moves little by little.
// The line is saying: " Hey physic word, move everything forward a tiny bit - just like one frame of a movie that runs at 60 frame per second"
// In the simplest way:
//  - 1 / 60: This tells the physics world how long one step is (like one tiny moment in time).
//  - deltaTime: This is how much real time has passed since the last step, so the world knows if it needs to catch up.
//  - 3: This is like saying “try up to 3 times to catch up if things are too fast or glitchy.”


// 📌📌📌 NOTE:
// ===== .quaternions and .setFromAxisAngle
// .quaternions class: 
// From Cannon.js. Represent rotation in 3D space. Used to avoid problems like gimbal lock (which can happen when using Euler angles for rotations).

// .setFromAxisAngle Method:
// From Cannon.js Quaternions class. Used to rotate an object around an axis (like X, Y, or Z). Requires 2 parameters


// 📌📌📌 NOTE:
// ===== Understanding Class, Method, and Property in JavaScript (Three.js & Cannon.js)
// 🟢 Class:
// A class is a blueprint (plan/ template) for creating objects. You use it with new to make an instance of something — like a vector, mesh, or body.
// So, when you create an instance, you're making a real thing based on a plan (the class)

// ✅ How to Recognize a Class:
// - Usually starts with a capital letter
// - Used with new
// - Represents a type of object
// - Does not end with (), but when we want to create an instance of the class (a real object from the blueprint), then we use ()
// - In docs: “This class represents…”

// 🔹 Example -> 
// const vector = new THREE.Vector3(1, 2, 3);

// - THREE.Vector3 is a class
// - vector is an object created from that class


// 🟢 Property:
// A property is a piece of data stored inside an object. It describes or holds a value — like position, color, size, rotation, etc.

// ✅ How to Recognize a Property:
// - Accessed with a dot: object.property
// - Has no ()
// - Used to get or set values
// - In docs: Described as a type (e.g. “Vector3”, “Number”)

// 🔹 Example ->  
// mesh.position.x = 1;

// - position is a property of mesh
// - x is a property of position


// 🟢 Method (function):
// A method is a function attached to an object or class. It performs an action — like setting values, updating data, or calculating something.

// ✅ How to Recognize a Method:
// - Ends with ()
// - Often starts with a verb: set(), copy(), add()
// - Does something (changes state or returns a result)
// - In docs: Described as “Sets...”, “Returns...”, etc.

// 🔹 Example -> 
// mesh.position.set(1, 2, 3);

// - set() is a method — it performs an action
// - It changes the values of the position property


// 🟢 constructor (Special Kind of Method):
// A constructor is a special method inside a class. It runs once when you create an instance using new. It sets up the object's initial properties.

// ✅ How to Recognize a Constructor:
// - Always named constructor (in classes)
// - Found inside a class
// - Runs automatically when you use new
// - Used to set up the object with values

// 🔹 Example - 
// class Car {
//     constructor(color, model) {
//       this.color = color;
//       this.model = model;
//     }
//   }
//   const myCar = new Car('red', 'Toyota');

// - constructor is the method that gives the object its starting values.


// 📌📌📌 NOTE:
// ===== Material
// When the ball falls on the floor it does not bounce. When the ball falls onto the floor and does not bounce, it’s not about the visual material — it’s about the physics material (sometimes called contact material or material options depending on the physics engine we are using).
// To fix this, we create a physics material (plastic, rubber, concrete, etc).
// ✔ A visual material (like MeshStandardMaterial) controls how things look (plastic, jelly, etc).
// ✔ A physics material controls how things move/react (bounce, slide, stick).

// ContactMaterial:  
// Defines how two materials interact when they collide, specifically things like:
// Friction: How slippery or sticky the contact is
// Restitution: How bouncy the contact is (elasticity)
// Contact stiffness and relaxation: For how "hard" or "soft" the materials behave during collision
// Friction equation tuning: For more realistic or stable results


// 📌📌📌 NOTE:
// ===== Apply forces:
// Ways to apply forces to a Body:
// - ApplyForce: to apply a force to the Body from a specified point in space (not necessarily on the Body's surface) like the wind that pushes everything a little all the time, a small but sudden push on a domino or a greater sudden force to make an angry bird jump toward the enemy castle.
// - ApplyImpulse: is like applyForce but instead of adding to the force that will result in velocity changes, it applies directly to the velocity.
// - ApplyLocalForce: is the same as applyForce but the coordinates are local to the Body (meaning that 0, 0, 0 would be the center of the Body).
// - ApplyLocalImpulse: is the same as applyImpulse but the coordinates are local to the Body.


// 📌📌📌 NOTE:
// ===== SAPBroadphase()
// world.broadphase is how Cannon.js figures out which objects might collide.
// By default, Cannon uses a basic method called NaiveBroadphase, which checks every object against every other (very slow when there are many objects).
// CANNON.SAPBroadphase (SAP = Sweep and Prune) is smarter and faster, especially when:
// - We have many objects
// - They’re mostly moving in straight lines or not moving much







// ===== Imports =====
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as CANNON from 'cannon-es' // Import Cannon.js after installing.



// =============================
//           Debug
// =============================
const gui = new GUI()

// gui.add requires an object and a property name (string) to create a control.
// We use debugObject to hold properties or functions we want to expose to the GUI.
const debugObject = {}

// ===== Sphere tweak =====
debugObject.createSphere = () => {
    createSphere( // Params ⮕ radius, position 
        Math.random() * 0.5, // Radius
        { // Position x, y, z
            x: (Math.random() - 0.5) * 3, 
            y: 3, // Can also add random values to Y-axis
            z: (Math.random() - 0.5) * 3, 
        }
    )
}

// ===== Box tweak =====
debugObject.createBox = () => {
    createBox( // 4 Params ⮕ width, height, depth, position
        Math.random(), // Width
        Math.random(), // Height
        Math.random(), // Depth
        { // Position x, y, z
            x: (Math.random() - 0.5) * 3, 
            y: 3, // Can also add random values to Y-axis
            z: (Math.random() - 0.5) * 3, 
        }
    )
}

// ===== Remove stuff tweak =====
debugObject.reset = () => {
    for (const object of objectsToUpdate){
        
        // Remove physics world
        object.body.removeEventListener('colide', playHitSound)
        world.removeBody(object.body)

        // Remove mesh
        scene.remove(object.mesh)
    }

    objectsToUpdate.splice(0, objectsToUpdate.length)
}


gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

// =============================
//            Base
// =============================
// ===== Canvas =====
const canvas = document.querySelector('canvas.webgl')

// ===== Scene =====
const scene = new THREE.Scene()


// =============================
//            Sounds
// =============================

const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    
    if (impactStrength > 1.5){
        hitSound.volume = Math.random() 
        hitSound.currentTime = 0
        hitSound.play()
    } 
}
//Todo:
// If we wanted to go even further, we could have multiple slightly different hit sounds. And to prevent having too many sounds playing simultaneously, we could add a very short delay where the sound cannot play again after being played once.


// =============================
//            Textures
// =============================
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])


// =============================
//        Physics World
// =============================
// 📌📌📌 NOTE: See top of the page for notes about physics. ⬆

// ===== World (like scene in three.js) =====
// The CANNON.World is just a simulation container for physics bodies and their behaviors (gravity, forces, collisions).
const world = new CANNON.World() // Creates a new instance of the World class from the CANNON physics library. 

// 📌📌📌 NOTE: See top of the page for notes about "SAPBroadphase()" ⬆
// Sets up a more efficient collision detection system in your physics world.
world.broadphase = new CANNON.SAPBroadphase(world)

// .allowSleep boosts performance by letting still objects "sleep".
// Sleeping objects aren’t updated until something moves or hits them.
// Once asleep, the physics engine stops updating it until something moves or hits it again.
world.allowSleep = true



// X-axis. 0 means there's no gravity pulling objects left or right
// Y-axis: -9.82 is the standard acceleration due to Earth's gravity. It pulls objects downward, just like gravity does on Earth.
//  Z-axis. 0 means no gravity pulling forward or backward.
world.gravity.set(0, -9.82, 0) // Adds gravity in x, y, z axes.


// ===== Material =====

// 📌📌📌 NOTE: See top of the page for notes about "Material" ⬆

// Create one default material for when we want consistent friction and bounce for all objects.
const defaultMaterial = new CANNON.Material('default')

// or can use multiple materials if we want different surfaces to behave uniquely. 
// const concreteMaterial = new CANNON.Material('concrete')
// const plasticMaterial = new CANNON.Material('plastic')

// Define how 'concrete' and 'plastic' interact when they collide
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial, 
    defaultMaterial,
    {
        friction: 0.1, // Low friction means the materials will slide easily
        restitution: 0.7, // High restitution means the collision will be quite bouncy
    }
)
// Tells the physics world to use low friction and high bounce when concrete and plastic materials collide.
world.addContactMaterial(defaultContactMaterial)
// The ContactMaterial won’t have any effect unless we assign the correct materials to the sphere and floor.


//  ===== Floor =====
const floorShape = new CANNON.Plane() // Create a new plane shape — similar to PlaneGeometry in Three.js
const floorBody = new CANNON.Body() // Create a new physics body — similar to a Mesh in Three.js

// Set the mass of the body to 0 to make it static (it won't fall or move)
floorBody.mass = 0  // If we want a movable object, we give it a mass greater than 0, like: floorBody.mass = 1
floorBody.material = defaultMaterial // Assign the 'default' material to the floor for custom collision behavior

// To add multiple shapes, use body.addShape(...) after creating the body() not inside the " CANNON.body ".
floorBody.addShape(floorShape) 

//  NOTE: See top of the page for notes about "quaternion" and "setFromAxisAngle" ⬆

// In Cannon.js, we CANNOT use .rotation like in Three.js to rotate objects. Instead, we use quaternion.setFromAxisAngle(axis, angle) to apply rotation.
// By default, CANNON.Plane stands upright like a wall. To make it horizontal like a real floor, we rotate it 90° around the X-axis.
floorBody.quaternion.setFromAxisAngle( // Params ⮕ axis, angle
    new CANNON.Vec3(-1, 0 , 0), // Rotates around X-axis
    Math.PI / 2 // Gives us a quarter of a full rotation (90 degrees angle)
)
world.addBody(floorBody)


// =============================
//            Floor
// =============================
// By default, THREE.PlaneGeometry is created standing up vertically, like a wall. We want it to be flat — like the ground we walk on, so we rorate the floor 90 degrees. See notes on " floor.rotation " ⬇
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
// Math.PI is 180 degrees.
// So Math.PI * 0.5 is 90 degrees.
// The negative sign means we rotate clockwise around the X-axis.
floor.rotation.x = - Math.PI / 2 // Rotates the floor by 90 degrees, so it's lying flat like the ground 
scene.add(floor)



// =============================
//            Lights
// =============================
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)



// =============================
//            Sizes
// =============================
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // ===== Update sizes =====
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // ===== Update camera =====
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // ===== Update renderer =====
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



// =============================
//            Camera
// =============================
// ===== Base camera =====
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// ===== Controls =====
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



// =============================
//            Renderer
// =============================
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



// =============================
//            Utilities
// =============================
const objectsToUpdate = []


// ===== Sphere =====
// ==================
// Create a visual mesh using a sphere geometry and a standard material.
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const phereMaterial =  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})

// Function to create a sphere with both visual (Three.js) and physical (Cannon.js) components.
const createSphere = (radius, position) => {

    // ===== Three.js Mesh =====
      // Create a mesh by combining the predefined sphere geometry and material
    const mesh = new THREE.Mesh(sphereGeometry, phereMaterial)

    // Scale the mesh in all directions by the radius (scales the unit sphere to desired size)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    // 'position' is a plain JS object (not a Vector3 or Vec3) with x, y, z values.
    // Both Three.js and Cannon.js can use this object in their `.copy()` methods.
    mesh.position.copy(position) // Position values: x:0, y:3, z:0
    scene.add(mesh)  // Enable shadow casting for the mesh

    // ===== Cannon.js Body =====
    const shape = new CANNON.Sphere(radius) // Create a physics sphere shape with the same radius
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),  // Initial position (will be overwritten by .copy below)
        shape: shape,
        material: defaultMaterial, // Assign the 'default' material to the floor for custom collision behavior
    })
    // 'position' is a plain JS object (not a Vector3 or Vec3) with x, y, z values.
    // Both Three.js and Cannon.js can use this object in their `.copy()` methods.
    body.position.copy(position) // Position values:x:0, y:3, z:0

     // When adding this line and tweak createSphere in the gui we may have an error on the console about User didnt interact with the document, IGNORE THAT ERROR.
     body.addEventListener('collide', playHitSound) 

    world.addBody(body)  // Add the body to the Cannon.js physics world

    // ===== Save in objects to update =====
    objectsToUpdate.push({
        mesh: mesh,
        body: body,
    })
}
// Passing a plain object (not a Vector3 or Vec3) with x, y, z values.
// Both Three.js and Cannon.js can copy from this object because their `.copy()` methods
// accept any object with x, y, z properties.
createSphere(0.5, {x:0, y:3, z:0}) // Params ⮕ radius, position 
// createSphere(0.5, {x:2, y:3, z:2}) // Can add multiple spheres to the floor
             


// ===== Box =====
// ===============
// Create a visual mesh using a box geometry and a standard material.
const boxGeometry = new THREE.BoxGeometry(1, 1, 1) // 3 Params ⮕ width, height, depth
const boxMaterial =  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})

// Function to create a box with both visual (Three.js) and physical (Cannon.js) components.
const createBox = (width, height, depth, position) => {

    // ===== Three.js Mesh =====
      // Create a mesh by combining the predefined box geometry and material
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)

    // Scale the mesh in all directions by the radius (scales the unit sphere to desired size)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    // 'position' is a plain JS object (not a Vector3 or Vec3) with x, y, z values.
    // Both Three.js and Cannon.js can use this object in their `.copy()` methods.
    mesh.position.copy(position) // Position values: x:0, y:3, z:0
    scene.add(mesh)  // Enable shadow casting for the mesh



    // ===== Cannon.js Body =====
    // Create a box shape for the physics body
    // 📌📌📌 NOTE: Cannon.js expects half the size for each dimension (width, height, depth) so we divide each value by 2
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)) // Create a physics sphere shape with the same radius
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),  // Initial position (will be overwritten by .copy below)
        shape: shape,
        material: defaultMaterial, // Assign the 'default' material to the floor for custom collision behavior
    })
    // 'position' is a plain JS object (not a Vector3 or Vec3) with x, y, z values.
    // Both Three.js and Cannon.js can use this object in their `.copy()` methods.
    body.position.copy(position) // Position values:x:0, y:3, z:0
    
    // When adding this line and tweak createBox in the gui we may have an error on the console about favicon, IGNORE THAT ERROR.
    body.addEventListener('collide', playHitSound) 
    world.addBody(body)  // Add the body to the Cannon.js physics world


    // ===== Save in objects to update =====
    objectsToUpdate.push({
        mesh: mesh,
        body: body,
    })
}


// =============================
//            Animate
// =============================
//📌📌📌  NOTE:   See the top of the page for notes about animation section. ⬆

const clock = new THREE.Clock() // Create a new THREE.Clock instance to track time since the application started
let oldElapseTime = 0 // How much time spent since the last tick

// The tick function is an animation loop that runs continuously to update the physics simulation and render the scene in Three.js. 
const tick = () => // The tick function is our frame loop.
{
    const elapsedTime = clock.getElapsedTime()  // Get the total time since the clock started (in seconds)
    const deltaTime = elapsedTime - oldElapseTime  // Calculate the time difference between this frame and the last frame
    
    // Store the current elapsed time for use in the next frame
    oldElapseTime = elapsedTime
    

    // ===== Update physics world =====
    
    // We must update our cannon.js world and update our three.js sphere accordingly. We are using step(...) function.
    world.step(1 / 60, deltaTime, 3) // 3 Params ⮕ fixedTimeStep, How much time passed since the last step, how much iteration the world can apply to catch up with a potential delay.
    // console.log(sphereBody.position.y) 

    // Every object needs both position and quaternion updated:
    //  - Position tells it where the object is in space.
    //  - Quaternion tells it how the object is rotated.
   
   for (const object of objectsToUpdate){ // For each object that needs updating:
        // Copy the physics body's position to the visual mesh's position (move the mesh)
        object.mesh.position.copy(object.body.position) 

        // Copy the physics body's rotation (quaternion) to the mesh's rotation (rotate the mesh)
        object.mesh.quaternion.copy(object.body.quaternion)
   }

    // ===== Update controls =====
    // Update any user interactions (e.g., orbit controls) for this frame
    controls.update()


    // ===== Render =====
    // Render the current state of the scene from the perspective of the camera
    renderer.render(scene, camera)


    // ===== Call tick again on the next frame =====
    // Schedule the tick function to run again on the next animation frame
    window.requestAnimationFrame(tick)
}

tick()


