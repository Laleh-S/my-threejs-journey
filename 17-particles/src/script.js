//Todo Particle Pack:
// https://www.kenney.nl/assets/particle-pack


// We can have hundreds of thousands of particles on screen with a reasonable frame rate. 
// In WebGL, each particle is composed of a plane (two triangles) always facing the camera.


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Base
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Textures
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Prticles
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Geometry:

// Creating a custom geometry to hold our particles.
const particlesGeometry = new THREE.BufferGeometry() 
const particleCount = 2000 // Number of particles to create.
// Create a typed array to store the position data for all particles
const positions = new Float32Array(particleCount * 3) // Each particle needs 3 values (X, Y, Z), so total length is count * 3
const colors = new Float32Array(particleCount * 3) // Each particle needs 3 values (R, G, B) to define its color in RGB
// Fill the array with random values between -5 and +5
for (let i = 0; i < particleCount * 3; i++){
     // Math.random() gives 0 to 1
    // Subtract 0.5 → -0.5 to +0.5
    // Multiply by 10 → -5 to +5
    positions[i] = (Math.random() - 0.5) * 4
    colors[i] = Math.random() 
}
// Tell the geometry to use our positions as its "position" attribute
// The 3 means we need 3 values (x, y, z) for each vertex
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) 

// Can have diffrent colors for each particle by adding color attribute we different color values.
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Material:
const particlesMaterial = new THREE.PointsMaterial({ 
    // color: 0xff69b4 
})
// All the lines below are the propertie of particlesMaterial and they can go be created inside the brackets just like the color propertie as part of an object.
particlesMaterial.size = 0.1  // Defines the size of the points in pixels. 
particlesMaterial.sizeAttenuation = true // when is set to "true", it creates perspective. The farther away the particle is from the camera, the smaller it appears.
particlesMaterial.transparent = true // Always set transparency to true when using alphaMap.
particlesMaterial.alphaMap = particleTexture 
// When we set transparent: true, Three.js tries to blend see-through parts, but it doesn't always draw things in the right order. That can make some particles hide others.
// Can use any of the 3 solutions below depending on our projects. Can even combine the 3 of them for better results.

// 1- Alpha testing - tells Three.js not to draw really transparent parts of a texture. The alphaTest value (between 0 and 1) sets the cutoff—pixels with alpha lower than that value won’t be rendered. 
// For example, if alphaTest is 0.001, any pixel with alpha 0 will be skipped.
// particlesMaterial.alphaTest = 0.001

// 2- Depth testing - is a way for Three.js (and WebGL) to figure out which objects or pixels are in front of others in 3D space.
// particlesMaterial. depthTest = false

// 3- Depth Write - The particles won't write to the depth buffer — so when they’re drawn, they don’t block other objects behind them.

// In 3D rendering, there is something called a depth buffer (also known as a Z-buffer). 
// This buffer keeps track of how far each pixel on the screen is from the camera — basically, it helps the renderer know which object is in front of which.

// When depthWrite is true (which is the default):
//  - The material writes to the depth buffer, meaning it updates the "depth map" of what's visible to the camera.
//  - If an object is behind something else, it won't be rendered because it's occluded.

// When depthWrite is false:
//  - The material does not update the depth buffer.
//  - This means that other things can be drawn behind or in front of it without being hidden properly, which is sometimes useful for transparent objects like particles, smoke, or fog — or in your case, a galaxy made of particles.

particlesMaterial.depthWrite = false // deactiivating depthWrite prevents z-buffer issues

// There is also a fourth solution which is very different from the other three. can also impact the performances.
// 4- Blending - defines how the color of your transparent object mixes with the colors behind it — kind of like how Photoshop layers blend.
particlesMaterial.blending = THREE.AdditiveBlending // can affect performance, especially if you have a large number of particles.
particlesMaterial.vertexColors = true

// Points:

// Mesh vs Points
// Mesh = shows the whole shape (the surface).
// Points = shows only the dots (vertices) of the shape.

// Since "points" inherit from object3D, we can move, rotate, and scale it like any other object. Animate section ⬇
const particles = new THREE.Points( particlesGeometry, particlesMaterial) 
scene.add(particles)

// Test cube
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

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

    // Update particles
    // particles.rotation.y = elapsedTime * 0.2  // Animates all the particles as a whole
 
    for (let i = 0; i < particleCount; i++){
        // Each particle uses 3 values (X, Y, Z), stored sequentially in the array.
        // 'i' is the current particle index.
        // 'i * 3' gives the starting index of that particle's X value in the array.

        // Why i * 3?
        // Because each particle takes 3 slots: X, Y, and Z.
        // So:
        // Particle 0 → starts at index 0 * 3 = 0 → positions[0], [1], [2]
        // Particle 1 → starts at index 1 * 3 = 3 → positions[3], [4], [5]
        // Particle 2 → starts at index 2 * 3 = 6 → positions[6], [7], [8]

        const i3 = i * 3 // i3 is the starting index for this particle’s X, Y, Z in the array
        // So i3 is the starting index for each particle’s position in the array.
        // positions[i3] = Math.random();     // x
        // positions[i3 + 1] = Math.random(); // y
        // positions[i3 + 2] = Math.random(); // z
        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x) // Targeting only the y position of each particle, one by one.
        
        // Optional debug:
        // console.log(particlesGeometry.attributes.position.array)
    }
    particlesGeometry.attributes.position.needsUpdate = true // Inform Three.js that we updated the position attribute manually

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// White means fully opaque (no transparency).

// Black means fully transparent (completely see-through).