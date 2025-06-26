
// ⚠️ IMPORTANT Note: 
// Developers should add GUI tweaks progressively as they build the project — not at the end.
// Delaying the addition of tweaks can lead to missed opportunities for fine-tuning values and improving the scene.
// For instance, if physics with gravity is implemented, a tweak for gravity should be added immediately.
// If an object is created with a color, a color tweak should be added.
// When lights are introduced, tweaks for their intensity and color should also be included.


// 📌📌📌 Note:
// The different types of tweaks:
//  - Range —for numbers with minimum and maximum value
//  - Color —for colors with various formats
//  - Text —for simple texts
//  - Checkbox —for booleans (true or false)
//  - Select —for a choice from a list of values
//  - Button —to trigger functions

// Most tweaks can be added using gui.add(...), where the first parameter is the object and the second is the property of that object to be tweaked.
// The gui.add(...) method must be called after the object and its property have been created. Otherwise, lil-gui will be instructed to tweak something that doesn't exist yet.

// ➡️ Use gui.add() for booleans, numbers, and simple properties.
// ➡️ Use gui.addColor() specifically for color properties to get the proper UI and behavior.


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Debug
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
const gui = new GUI({
    width: 300, 
    title: 'My First Debug UI',
    closeFolders: false,
})
// gui.close()
// gui.hide()
window.addEventListener('keydown', (event) => {
    if(event.key === 'h'){
        gui.show(gui._hidden) // When is hidden press "h" to make it visible, and when is visible, press "h" to hide it again.
    }
})

const debugObject = { } // place holder for my properties.


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Base
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// ====== Canvas ======
const canvas = document.querySelector('canvas.webgl')

// ====== Scene =======
const scene = new THREE.Scene()


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Object
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤

// Creates an external color value for the GUI to control.
// lil-gui doesn't work directly with THREE.Color objects, so we use a plain hex string in a separate object (debugObject).
// When the color is changed in the GUI, we manually update the Three.js material.
debugObject.color = '#3a6ea6'

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: '#3a6ea6', wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// ====== Cube tweak Folders ======


// ====== Cube tweak Folders ======
const cubeFolder = gui.addFolder('My Awsome folder')
// cubeFolder.close() // Keeps the folder closed by default 

cubeFolder // Adding the following elevation tweak inside the folder i have created
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('elevation') // The lable displayed inside the controls.



// ====== Check box tweak ======
cubeFolder.add(mesh, 'visible')
cubeFolder.add(material, 'wireframe')


// ====== Color tweak ======
gui
    .addColor(debugObject, 'color')
    .onChange((value) => {
        material.color.set(debugObject.color)
    })


// ====== Button(function) tweak ======
debugObject.spin = () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 })
}
gui.add(debugObject, 'spin')


// ====== Geometry subdivision tweak ======
debugObject.subdivision = 2
gui
    .add(debugObject, 'subdivision') // Name it subdivision so you can use only one tweaks to change all segments, widthSegments, heightSegments, depthSegments.
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() => {
        mesh.geometry.dispose() // Must dispose the old geometry before creating the new one bleow.
        mesh.geometry = new THREE.BoxGeometry(
            1, 1, 1, 
            debugObject.subdivision, debugObject.subdivision, debugObject.subdivision)
    })



// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Sizes
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // ====== Update sizes ======
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // ====== Update camera ======
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // ====== Update renderer ======
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// In order to tweak a subdivisiion of a geometry first have to set the wireframe to true inside the material
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Camera
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// ====== Base camera ======
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// ====== Controls ======
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

    // ====== Update controls ======
    controls.update()

    // ====== Render ======
    renderer.render(scene, camera)

    // ====== Call tick again on the next frame ======
    window.requestAnimationFrame(tick)
}

tick()