// 📌📌📌 NOTE: 
// What is Raycaster:
// A Raycaster is a class in Three.js that casts an invisible ray in a specific direction to detect which 3D objects it intersects. It's commonly used for things like mouse picking, detecting clicks, or checking what the camera is looking at.
// When using Three.js's Raycaster, We need to specify both the origin and the direction of the ray. This defines where the ray starts and the direction it travels in 3D space.

// 📌📌📌 NOTE: 
// When we log `intersect` to the console:
// - It shows an array (e.g., [ { ... } ]) if the ray hits the object.
// - If there is no hit, it shows an empty array: []

// When we log `intersects` to the console:
// - It shows an array with all the objects hit by the ray (e.g., [ { ... }, { ... }, { ... } ]).
// - The array is sorted by distance from the ray origin (closest hit first).

// The result is always an array, even if only one object is tested,
// because a ray can intersect the same object multiple times.
// For example, with a donut shape (torus), the ray could hit it twice:
// once entering the ring, and once exiting it.


// The information inside the returned array when we expand each object:
//  - distance: the distance between the origin of the ray and the collision point.
//  - face: the face of the geometry that was hit by the ray.
//  - faceIndex: the index of that face.
//  - object: the object that was hit by the ray.
//  - point: a Vector3 representing the exact position in 3D space where the collision occurred.
//  - uv: the UV coordinates at the point of intersection (useful for texture-related effects).

// We can use this data:
//  - To detect if there's a wall in front of a player, you can check the `distance`.
//  - To change an object's color, modify the object's material.
//  - To show an explosion at the impact point, use the `point` position to spawn the effect.



// 📌📌📌 NOTE: 



// ===== Imports =====
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


// =============================
//              Base
// =============================

// ===== Debug =====
const gui = new GUI()


// ===== Canvas =====
const canvas = document.querySelector('canvas.webgl')


// ===== Scene =====
const scene = new THREE.Scene()


// =============================
//            Objects
// =============================
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)


const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)


// =============================
//          Raycaster
// =============================
// 📌📌📌 NOTE: See top of the page for notes about Raycaster ⬆

// ===== Raycasting for non-animated (static) objects ====

// Instantiate a Raycaster:
// const raycaster = new THREE.Raycaster() // Params ⮕ origin, direction. Defining the origin and direction params separately below.

// // This is where the ray starts — 3 units to the left on the X axis
// const rayOrigin = new THREE.Vector3(-3, 0, 0) 

// // This points toward the right on the X axis (positive X direction)
// const rayDirection = new THREE.Vector3(10, 0, 0) // Params ⮕ x: how far to move along the left/right axis, y: how far to move along the up/down axis, z: how far to move along the forward/backward axis.

// // Normalize the direction to ensure the ray has a length of 1
// // Always normalize raycaster if not, the ray might behave incorrectly or inconsistently — like appearing longer than expected or not detecting objects properly.
// rayDirection.normalize() 
// raycaster.set(rayOrigin, rayDirection)

// // Update objects before raycasting.
// scene.updateMatrixWorld()

// // 📌📌📌 NOTE: See top of the page for notes about intersect and intersects⬆
// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)


// ===== Raycasting for animated (moving) objects ====

const raycaster = new THREE.Raycaster()
// To do raycasting for animated (moving) objects in Three.js, we follow the same core approach as with static objects. 
// However, because animated objects change position (or shape) over time, we must perform the raycasting inside the animation loop (tick function). 
// This ensures the ray tests against the current position and state of the objects in each frame. See the tick function below ⬇



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
//            Mouse
// =============================
// Create a new 2D vector to store the mouse position in normalized device coordinates.
const mouse = new THREE.Vector2() // Vector2 is used because we only need X and Y, not Z.

// ===== Mouse Hover Detection =====
window.addEventListener('mousemove', (event) => { // The function is called when the mouse moves.
    // Convert mouse X coordinate from screen space (pixels) to normalized device coordinates (-1 to 1)
    mouse.x = event.clientX / sizes.width * 2 - 1

    // Convert mouse Y coordinate from screen space (pixels) to normalized device coordinates (-1 to 1)
    // Invert the Y axis because WebGL uses a bottom-left origin while the DOM uses a top-left origin
    mouse.y = - (event.clientY / sizes.height * 2 - 1) // We flip the Y coordinate because in the browser, Y starts at 0 at the top and increases downward, but in WebGL, Y = +1 is the top and -1 is the bottom.
    
    // Optional: Log mouse coordinates for debugging.
    // console.log(mouse.x)
    
    // - NOTE: Raycasting is not done here directly. Instead, the updated mouse position is used inside the tick() function, where the raycaster is updated every frame. ⬇   
})


window.addEventListener('click', (event) => {
    if (currentIntersect){
        if(currentIntersect.object === object1){
            console.log('click on object 1')
        } else if (currentIntersect.object === object2){
            console.log('click on object 2')
        } else if (currentIntersect.object === object3){
            console.log('click on object 3')
        }
    }
})


// =============================
//            Camera
// =============================
// ===== Base camera =====
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// ===== Controls =====
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// =============================
//           Renderer
// =============================
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



// =============================
//              Models
// =============================
// Instantiate GLTF loader
const gltfLoader = new GLTFLoader()

let model = null

// Start loading the glTF model
gltfLoader.load( // 2 Params ⮕ 1. The path to load the model. 2. The call back function that will be called when the model is loaded.
    '/models/Duck/glTF-Binary/Duck.glb',
    (gltf) => 
    {
        model = gltf.scene
        model.position.y = - 1.2

        // Add the full glTF scene to our main Three.js scene
        // This includes all meshes, lights, cameras, etc., from the glTF file.
        scene.add(model) 
    }
)

// We are testing if the cursor is on the Duck or not on each frame, meaning we need to configure the tick function. ⬇
// The raycaster is already set from the mouse and we can do our intersect test right after the code related to the test we did with the spheres.

// =============================
//            Lights
// =============================

// ====== Ambient light ======
const ambientLight = new THREE.AmbientLight('#ffffff', 0.9)
scene.add(ambientLight)

// ====== Directional light ======
const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)



// =============================
//           Animate
// =============================
const clock = new THREE.Clock()

let currentIntersect = null 

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // ===== Animate objects =====
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5 // Changes the speed of the movement.
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5 
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5 

    // Casting a ray 
    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)
    
    // Optional: View the intersection data in the console
    // console.log(intersects)

    // Loop through all objects and set their color to red by default
    for(const object of objectsToTest ){
        object.material.color.set('#ff0000') // Red = all spheres 
    }

    // Loop through only the intersected objects and change their color to blue
    for(const intersect of intersects){
        // Can access these through the console.log(intersects) above.
        intersect.object.material.color.set('#0000ff') // Blue = the one sphere that intersecting 
    }

    if (intersects.length){
        if (currentIntersect === null) {
            console.log('mouse enter')
        }
        if (currentIntersect) {
            console.log('mouse leave')
        }
        currentIntersect = intersects[0]
    } else {
        currentIntersect = null
    }

    // Instead of using intersectObjects (plural), we are going to use intersectObject (singular). It works just the same and will also return an array of intersections, but we have to send it an object instead of an array of objects.
    // ===== Test intersection with a model ======

    if(model){
        // By default, the Raycaster checks not only the object passed to intersectObject but also all of its children, recursively.
        // To disable this default behavior and test only the object itself (not its descendants), we can pass false as the second argument of intersectObject or intersectObjects.
        const modelIntersects = raycaster.intersectObject(model)  // default: checks `model` and all its children recursively
        // raycaster.intersectObject(model, false) // only checks `model`, not its children
        console.log(modelIntersects)  // Log the intersection details to the console.

        // If the ray intersects the model
        if(modelIntersects.length > 0){
            // Scale the model up by 20% on all axes (highlight or focus effect)
            model.scale.set(1.2, 1.2, 1.2)
        } else {
            // Reset the model's scale to its original size
            model.scale.set(1, 1, 1)
        }
    }

    // Before playing with the Duck size there are a few things to note.

// Recursive
// First, we are calling intersectObject on model, which is a Group, not a Mesh.

// You can test that by logging model right before assigning it in the loaded callback function:

    //  ===== Update controls =====
    // Update orbit controls (includes damping if enabled)
    controls.update()


    //  ===== Render =====
    // Render the current state of the scene from the camera's perspective
    renderer.render(scene, camera)


    //  ===== Call tick again on the next frame =====
    // Request the next frame and call tick again to keep the loop going
    window.requestAnimationFrame(tick)
}
// Start the animation/rendering loop
tick()


