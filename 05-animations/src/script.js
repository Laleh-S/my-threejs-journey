//! NOTES:
// Main purpose requestAnimationFrame: is to help create smooth, consistent animations 
// across different devices and screen refresh rates.

// Initial purpose requestAnimationFrame: is to call the function provided on the next frame.
// It will execute the function you provide on the next frame. 
// this function also uses requestAnimationFrame to execute that same function on the next frame, 
// you'll end up with your function being executed on each frame forever which is exactly what we want.

// The Problem:
// If the animation is based purely on frames, it will behave differently on different devices.
// High frame rate (e.g., 144Hz monitor) → Animation runs too fast.
// Low frame rate (e.g., 30Hz monitor) → Animation runs too slow.
// This is because each frame takes a different amount of time to appear.

// First Solution: -> Adaptation to the framerate
// To adapt the animation to the framerate, we need to know how much time it's been since the last tick.

//! Dependencies
// Installing greensock library:
// npm install --save gsap 
// import greensock

import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()


// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


// Sizes
const sizes = {
    width: 800,
    height: 600
}


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)




// Animation 
// We want our function to be called on each frame, so we use Requst Animation Frame. 
// The purpose of Request Animatio Frame is to call the function provided on the next frame.


// Animation - using Time
let time = Date.now()

const tickTime = () => {
    // Time: 
    // const currentTime = Date.now() // Control animations based on real-world time instead of frame rate.
    // const deltaTime = currentTime - time  // Get the difference between time and current time.
    // time = currentTime  // Updates the time variable so that it holds the most recent timestamp for the next frame.
    // console.log(deltaTime)
   

    // Update object: 
    // mesh.rotation.y += 0.001 * deltaTime // now the cube rotates at the same speed regardless of the framerate.
    

    // Render: 
    // renderer.render(scene, camera)

    // window.requestAnimationFrame(tick) // -> We pass the function here, not calling it.
}
tickTime()



// Animation - using Clock
const clock = new THREE.Clock() // instantiating the three.js built in clock class

const tickClock = () => {
    // Clock:
    // const elapsedTime = clock.getElapsedTime()
    // console.log(elapsedTime)
    

    // Update object:
    // mesh.rotation.y = elapsedTime * Math.PI * 2 // Rotation equals elapsedTime
    // mesh.position.y = elapsedTime 
    // mesh.position.y = Math.sin(elapsedTime)
    // mesh.position.x = Math.cos(elapsedTime)
    // camera.position.y = Math.sin(elapsedTime)
    // camera.position.x = Math.cos(elapsedTime)
    // camera.lookAt(mesh.position)
    

    // Render: 
    renderer.render(scene, camera)

    // We pass our function 'tick'. This tells the browser run tick again in the next frame.
    // The browser schedules tick to be called in the next animation frame (roughly 16.67ms later, assuming 60 FPS).
    window.requestAnimationFrame(tickClock) 
}
tickClock()


// Animation - using Greensock (GSAP) library
// The greensock library internally doing Request Animation Frame, so don't have to tell it to update.
// gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 }) // Specify duration, delay, and destination inside the object
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 }) 

const tick = () => 
{
    // Render:
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick() 





