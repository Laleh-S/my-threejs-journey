
//! Notes:
// Camera:

// ArrayCamera
// Used to render your scene multiple times by using multiple cameras. 

// StereoCamera
// Used to render the scene through two cameras that mimic the eyes in order to create what we call a parallax effect that will lure your brain into thinking that there is depth. 

// CubeCamera
// Used to get a render facing each direction (forward, backward, leftward, rightward, upward, and downward) to create a render of the surrounding. 
// Use it to create an environment map for reflection or a shadow map. We'll talk about those later.

// OrthographicCamera
// Used to create orthographic renders of your scene without perspective. It's useful for RTS game like Age of Empire. 
// Elements will have the same size on the screen regardless of their distance from the camera.

// PerspectiveCamera
// Used to mimic the way the human eye sees. It is the most common projection mode used for rendering a 3D scene.

//! Notes:
// In the browser:
// Moving the mouse down increases event.clientY.
// Moving the mouse up decreases event.clientY.

// In Three.js:
// Moving up should be positive.
// Moving down should be negative.

// Since event.clientY does the opposite, we make it negative to match Three.js's system.



import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'



// - CURSOR - //
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    // Convets cursor’s x-position into a value that ranges from -0.5 to 0.5, instead of using raw pixel values.
    // Without - 0.5 → cursor.x ranges from 0 (left) to 1 (right).
    // With - 0.5 → cursor.x ranges from -0.5 (left) to 0.5 (right).
    // Now, the center of the screen is at 0, which makes it more intuitive for animations and camera controls.
    cursor.x = event.clientX / sizes.width - 0.5 // cursor going right = value increases, cursor going left = value decreases.
    
    // Why we make cursor.y value negative? check //! notes⬆
    cursor.y = - (event.clientY / sizes.height - 0.5) // cursor going down = value increases, going up = value decreases.
    console.log(cursor.x)
})


// - BASE - //

// Canvas
// Is the screen where the 3D world is displayed.
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}


// Scene
    const scene = new THREE.Scene()


// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)


// Camera

// - PerspectiveCamera:
    // Parameters 
    // First - field of view: its a vertical vision angle by default. Usually between 45 to 75, decide early in our project.
    // Second - aspect ratio: width of the render divided by the height of the render.
    // Third - near and far: any object closer than near and further than far wont show.
    
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    // camera.position.x = 2
    // camera.position.y = 2
    camera.position.z = 3


// - OrthographicCamera:
    // Parameters
    // First: left, right, top, bottom
    // Second: near and far

    // const aspectRatio = sizes.width / sizes.height
    // console.log(aspectRatio)
    // const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100 )

    // camera.position.x = 2
    // camera.position.y = 2
    // camera.position.z = 2


    camera.lookAt(mesh.position)
    scene.add(camera)


// Controls: 

//  OrbitControls needs:
// Camera to control what the user sees.
// Canvas to get the user input for interacting with the scene. 
const controls = new OrbitControls(camera, canvas)

// By default the camera is looking at the center of the scene.
// To changed that:
    // controls.target.y = 2
    // controls.update()

// Damping smoothes the animation by adding acceleration or friction:
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects:
    // mesh.rotation.y = elapsedTime;

    // Update camera:
    // rotates the camera to circle around the cube
    // Math.PI is used to do half a rotation so for a full rotation we multiple it by 2
    // Math.sin creates a circular motion. 
    // The * 3 sets the camera distance from the cube
    // Math.cos keeps it in sync with Math.sin for a circular path.

        // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3 
        // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
        // camera.position.y = cursor.y * 5
        // camera.lookAt(mesh.position) // Move the camera first, then make it to look at the target.

    // Update controls:
        controls.update()

    // Render:
        renderer.render(scene, camera)

    // Call tick again on the next frame
        window.requestAnimationFrame(tick)
}

tick()