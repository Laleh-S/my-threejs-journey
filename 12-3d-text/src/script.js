//todo: Tools for converting a font
// https://gero3.github.io/facetype.js/

//todo: List of matcap materials to download from
// Make sure you have the lisence to used them if its not for personal use.
// https://github.com/nidorx/matcaps


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
// One way of using a font is to import it, or create a folder inside static and add the font and license there
// import typefaceFonts from 'three/examples/fonts/helvetiker_regular.typeface.json' 

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Base
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper: 
// To help us find where the center is.
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)



// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Textures
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace // Ensures that the texture is interpreted correctly


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Fonts
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// One fontloader can load multiple fonts
const fontLoader = new FontLoader()
// The first parameter inside load is the path to the font, 
// The second parameter inside load is a function that will get triggered after the font is loaded.
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => { 

    // First parameter is your text second is an object.
    const textGeometry = new TextGeometry('Hello Three.js', {
        font: font,
        size: 0.5,
        depth: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0, 
        bevelSegments: 4
    })
// Centering text using calculations
//  Bounding: is the information associated with the geometry that tells what space is taken by that geometry. 
//  It can be a "box" or a "sphere". By default three.js uses sphere so if we want to use box bounding
//  we have to calculate it ourselves.
// textGeometry.translate(
//     // max.x / 2 calculates half of the maximum X value of the bounding box.
//     - (textGeometry.boundingBox.max.x - 0.2) / 2, // Moves the text left to center it along the X-axis.
//     - (textGeometry.boundingBox.max.y - 0.2) / 2, // Moves the text down to center it along the Y-axis.
//     - (textGeometry.boundingBox.max.z - 0.3) / 2  // Moves it forward/backward to center it along the Z-axis.
// )
textGeometry.center() // We can use the center() method
    // Using one material for both text and donut. 
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture }) 
    // textMaterial.wireframe = true
    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)

    // Create "TorusGeometry" and "MeshMatcapMaterial" outsidethe loop to avoid  generating 100 separate instances of them.
    // This improves performance, memory efficiency, and rendering speed.
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

    for (let i = 0; i < 100; i++){
        const donut = new THREE.Mesh(donutGeometry, material)

        donut.position.x = (Math.random() - 0.5) * 10
        donut.position.y = (Math.random() - 0.5) * 10
        donut.position.z = (Math.random() - 0.5) * 10

        // Rotates donuts in the x and y axes
        donut.rotation.x = Math.random() * Math.PI 
        donut.rotation.y = Math.random() * Math.PI 

        const scale = Math.random()
        donut.scale.set(scale, scale, scale)
        

        scene.add(donut)
    }
})


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Object
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Sizes
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
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

// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Camera
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Renderer
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Animate
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
const clock = new THREE.Clock() // In the latest verion of three.js we have access to new version of clock called timer

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