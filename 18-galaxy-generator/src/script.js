
// Todo:  Go further 
// Can try to add more tweaks or test other galaxy shapes. 
// Rotate the whole galaxy.
// Can create multiple galaxies.



import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Base
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Debug
const gui = new GUI({ width: 300 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Galaxy 
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤

const parameters = {} // We must have an object to add tweaks to our gui
parameters.count = 100000 // Number of particles or vertex.
parameters.size = 0.01
parameters.radius = 5 // How far the galaxy stretches from the center
parameters.branches = 3 // Branches of the galaxy
parameters.spin = 1 // How twisted the spiral is
parameters.randomness = 0.2 // How far a star can stray from its ideal position
parameters.randomnessPower = 3  // How randomness behaves (how tightly stars cluster)
parameters.innerColor = '#ff6030'
parameters.outerColor = '#1b3984'

// Declare reusable variables outside the function so we can dispose of them later. 
let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    
       // If a galaxy already exists, clean it up before creating a new one.
    if (points !== null){
        geometry.dispose() // Free up GPU memory used by the geometry
        material.dispose() // Free up GPU memory used by the material
        scene.remove(points) // Remove the points object from the scene
    }


    //  Geometry:
    geometry = new THREE.BufferGeometry() // Empty geometry container for my particles. Waiting to be filled with the data that defines a 3D object.

    // Create a typed array to hold all X, Y, Z positions
    const positions = new Float32Array(parameters.count * 3) // In 3D coordinates, each particle/vertex/ needs 3 values: X, Y, Z (postion in 3D space) → positions = [x1, y1, z1, x2, y2, z2, x3, y3, z3, ...] So if we want 100 particles/vertexes → the array will have 300 values.
    const colors = new Float32Array(parameters.count * 3)  // Each particle needs 3 values (R, G, B) to define its color in RGB
    
    // Creating instances of the color for the inner and outer color
    const innerColor = new THREE.Color(parameters.innerColor)
    const outerColor = new THREE.Color(parameters.outerColor)

    for (let i = 0; i < parameters.count; i ++){ // Loops through each particle/vertex.

        // Since each particle uses 3 positions, we need to track where each particle starts in the array.
        // i tells us which particle we’re on.
        // i * 3 tells us the starting index of the current particle’s 3 values in the array.

        // Why i * 3?
        // If you're on particle i, and each particle takes up 3 spots (X, Y, Z), then:
        // Particle 0 starts at index 0 * 3 = 0 ⮕ positions[0], positions[1], positions[2]
        // Particle 1 starts at index 1 * 3 = 3 ⮕ positions[3], positions[4], positions[5]
        // Particle 2 starts at index 2 * 3 = 6 ⮕ positions[6], positions[7], positions[8]

        const i3 = i * 3 // Managing the positions array, which stores the coordinates of each particle in 3D space.
        

        // ----- Position:

        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        
        // - i % parameters.branches → creates a repeating pattern:
        // 0, 1, 2, 0, 1, 2, ... (if branches = 3) 
        // → Assigns each particle to a branch (like: “Which branch does it belong to?”)

        // - / parameters.branches ⮕ turns branch number into a fraction:
        // 0 / 3 = 0
        // 1 / 3 = 0.333...
        // 2 / 3 = 0.666...
        // → Helps space branches evenly around a circle

        // - * Math.PI * 2 ⮕ converts the fraction to radians (a full circle is 2π):
        // 0       ⮕ 0°
        // 0.333... ⮕ 120°
        // 0.666... ⮕ 240°
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        // - Math.random() ⮕ creates a random number between 0 and 1
        // - ** parameters.randomnessPower ⮕ raises that random number to the power of parameters.randomnessPower
        // - * (Math.random() < 0.5 ? 1 : -1) ⮕ Math.random() gives you a number between 0 and 1. If Math.random() is less than 0.5 → Multiply by -1 → Result is negative. If Math.random() is 0.5 or more → Multiply by 1 → Result is positive.
        const randomX = Math.random() ** parameters.randomnessPower * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.random() ** parameters.randomnessPower * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.random() ** parameters.randomnessPower * (Math.random() < 0.5 ? 1 : -1);
        
        // Now we fill the aray with random values. We dont multiply parameters.count by 3 because we only want to fill one third of the array.
        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX// x -> Do not need + 0 but i included for clarity
        positions[i3 + 1] = 0 + randomY // y
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ// z
        // console.log(positions) // Shows all the array on the console


        
        // ----- Color:

        // The .lerp method: 
        // Stands for Linear Interpolation, used to find a value between two points based on a ratio or percentage. It helps transition smoothly from one value to another. 
        // In Three.js and other 3D libraries, .lerp is often used for interpolating between vectors or colors.

        // When using lerp to blend two colors, we must clone the initial color because lerp modifies it. Without cloning, the original color is changed, causing unintended effects, especially when applying interpolation to multiple colors.
        const mixedColor = innerColor.clone() // Clone the innerColor to ensure that we don't modify the original innerColor object.
        mixedColor.lerp(outerColor, radius / parameters.radius) // radius / parameters.radius is used to determine how far along the interpolation the particle should be.
        
        // Now, we assign the interpolated (mixed) color values to the colors array for this particle:
        // mixedColor.r will give the red component of the color
        colors[i3 + 0] = mixedColor.r // Red 
        colors[i3 + 1] = mixedColor.g // Green
        colors[i3 + 2] = mixedColor.b // Blue

    }
    geometry.setAttribute(
        'position', // The name of 
        new THREE.BufferAttribute(positions, 3) // 3 is the number of values: X, Y, Z  per particle/vertex 
    )

    geometry.setAttribute(
        'color', 
        new THREE.BufferAttribute(colors, 3) // 3 is the number of values: R, G, B  
    )


    //  Material:
    material = new THREE.PointsMaterial({
        size: parameters.size, 
        sizeAttenuation: true, // when is set to "true", it creates perspective. The farther away the particle is from the camera, the smaller it appears.
        // Disabling depthWrite means the particles won't update the depth buffer.
        // The depth buffer tracks how far objects are from the camera to decide what's in front.
        // When depthWrite is true (default), closer objects can hide farther ones.
        // When set to false, all particles remain visible even if they overlap, which is useful for effects like galaxies, fog, or smoke.
        depthWrite: false, // Prevent particles from blocking each other visually
        blending: THREE.AdditiveBlending,  // Blending - defines how the color of our transparent object mixes with the colors behind it. 
        vertexColors: true,
    })



    //  Points: 
    points = new THREE.Points(geometry, material) // Just like "Mesh" we add the geometry and material to out "Points".
    scene.add(points)

}
generateGalaxy()

// why not use onChange? because it fires continuously as you move the slider. This means every tiny change while dragging will trigger generateGalaxy() which can cause lag or sluggish performance.


// Gui debug panel

// Every time generateGalaxy() runs (triggered by changing the GUI parameters below), it creates a new THREE.Points object and adds it to the scene — but it doesn’t remove the previous one.
// As a result, each change adds a new galaxy on top of the old one, causing: overlapping galaxies, performance drops, memory spikes, and visual glitches—especially with high particle counts.
gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'innerColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outerColor').onFinishChange(generateGalaxy)



// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Sizes
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Camera
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Renderer
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Animate
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


