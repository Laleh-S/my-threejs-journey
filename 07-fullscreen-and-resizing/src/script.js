import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


/**
 * Base
 */

// ≋≋≋≋≋≋≋≋≋≋≋≋
// Canvas
// ≋≋≋≋≋≋≋≋≋≋≋≋
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// ≋≋≋≋≋≋≋≋≋≋≋≋
// Object
// ≋≋≋≋≋≋≋≋≋≋≋≋
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Sizes
// ≋≋≋≋≋≋≋≋≋≋≋≋
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes:
    sizes.width = window.innerWidth
    sizes.height = innerHeight

    // Update camera:
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer:
    // Updating renderer will update the canvas accordingly.
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Handel full Screen
// Double click to go to full screen, then double click to escape fullscreen.
window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen() // <- requestFullscreen() is a method available on HTML.
        
    } else {
        document.exitFullscreen()
    }
})


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Camera
// ≋≋≋≋≋≋≋≋≋≋≋≋
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



// ≋≋≋≋≋≋≋≋≋≋≋≋
// Renderer
// ≋≋≋≋≋≋≋≋≋≋≋≋
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Pixel Ratio
// Corresponds to how many physical pixels you have on the screen for one pixel unit on the software part.
// If we are trying to test our code with the devices with a very high pixel ratio of 4 and 5, we end up doing so many renders. 
// So we have to limit this the value of pixel ratio to 2.
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // My device pixel ratio is 2


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Animate
// ≋≋≋≋≋≋≋≋≋≋≋≋
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

