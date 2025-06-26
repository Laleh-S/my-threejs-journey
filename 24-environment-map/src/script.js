// ⚠️ Blender shortcuts:
//  https://docs.google.com/document/d/1wZzJrEgNye2ZQqwe8oBh54AXwF5cYIe56EGFe2bb0QU/edit?usp=sharing


// 📌📌📌 NOTE:
// The .hdr files inside the /static/environmentMaps/ folder will will get a preview of that environment map (if you don’t get a preview, it doesn’t mean you can’t use it in Three.js).
// This file has two specific features:

// First, the file extension is .hdr. HDR stands for “High Dynamic Range” (we often say “HDRI” , where the “I” stands for “Image”). 
// It means that the color values stored have a much higher range than a traditional image, which makes it ideal to store luminosity data.

// Secondly, if you check the preview, you’ll notice that it’s only one picture containing kind of a 360° view of the surrounding.
// The picture’s not just horizontal as we can also see the sky and the floor, although these sections are being stretched. The proper name for such projection is “equirectangular”.

// Note that an HDR environment map doesn’t have to be equirectangular, but it’s often the case and Three.js (like most 3D software packages, libraries and engines) supports this projection.


// 📌📌📌 NOTE:
// HDR (High Dynamic Range): used with RGBELoader (for .hdr files) or EXRLoader (for .exr). Perfect for environment maps (like skyboxes), reflections, and lighting in realistic 3D scenes.
// LDR (Low Dynamic Range): loaded with TextureLoader (for .jpg or .png). Good for regular textures, backgrounds, and simple scenes without advanced lighting. LDR images can be used to light up a scene in Three.js.

// Equirectangular map: is a 2D texture that represents a 360° environment (both horizontal and vertical) as a flat rectangular image. works with .hdr, .exr, .jpg, .png
// Because Three.js can project this flat image as a 360° environment, it's commonly used for: Backgrounds, Skyboxes, Environment lighting (especially with PBR materials), Reflections on objects.


// 📌📌📌 NOTE:
// Layers:
// In Three.js, layers are used to control which objects are visible to which cameras, lights, or effects. This allows for selective rendering, meaning you can have objects visible only to certain cameras or lights — very useful for things like reflections, post-processing, or debugging visuals.
// Careful with layers, it is easy to get lost in what being rendered. Lights are not affected by layers.



// ====== Imports ======
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js'



// =============================
// Loaders
// =============================
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()
const exrLoader = new EXRLoader()
const textureLoader = new THREE.TextureLoader()


// RGBE (red, green, blue, exponent(brightness)) loader stores the brightness. It's the encoding for the 'HDR' format.

// =============================
// Base
// =============================
// ====== Debug ======
const gui = new GUI()


// ====== Canvas ======
const canvas = document.querySelector('canvas.webgl')

// ====== Scene ======
const scene = new THREE.Scene()


// =============================
// Environment map
// =============================
scene.environmentIntensity = 1  // Environmental intensity means the lighting and reflection. 
scene.backgroundBlurriness = 0 
scene.backgroundIntensity = 1
// scene.backgroundRotation.x = 1
// scene.environmentRotation.x = 2

gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.001)
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001)

gui.add(scene.backgroundRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('backgroundRotation-Y') // Math.PI is half a circle and multiply by 2 will create a full circle. 
gui.add(scene.environmentRotation, 'y').min(0).max(Math.PI * 2).step(0.001).name('environmentRotation-Y')



// 📌📌📌 NOTE: See top of the page for notes about LDR, HDR, and Equirectangular Map ⬆

// ====== LDR (Low Dynamic Range) cube texture ======

// These textures form a cube map made of 6 images (one for each face of a cube), so we use cubeTextureLoader.
// const environmentMap = cubeTextureLoader.load([ 
//     // The order matters: +X, -X, +Y, -Y, +Z, -Z
//     '/environmentMaps/0/px.png', // +X (right)
//     '/environmentMaps/0/nx.png', // -X (left)
//     '/environmentMaps/0/py.png', // +Y (top)
//     '/environmentMaps/0/ny.png', // -Y (bottom)
//     '/environmentMaps/0/pz.png', // +Z (front)
//     '/environmentMaps/0/nz.png', // -Z (back)
// ])
// // Asigning the environmetMap to the scene's background (after creating the environmentMap and the scene)
// scene.background = environmentMap
// // This applies the environment map as lighting to the whole scene by assigning it to the scene's environment property.
// scene.environment = environmentMap



// ====== HDR (RGBE) Equirectangular ======

// 🚫 NOTE: .hdr files are heavier to load and render. To improve performance, use a lower resolution and apply HDR environment maps only for lighting, not necessarily for the background.

// Load a high dynamic range (HDR) environment map using RGBELoader
// rgbeLoader.load('/environmentMaps/blender-2k.hdr', (environmentMap) => {

//     // Set the environment map's mapping mode to equirectangular reflection mapping. This ensures proper rendering of reflections based on camera orientation
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping
    
//     // Set the loaded HDR image as the scene's background
//     scene.background = environmentMap
//     // Use the same HDR image to light up the scene (for realistic lighting and reflections)
//     scene.environment = environmentMap
// })


//* NVIDIA
// ====== HDR (EXR) Equirectangular ======

// 🚫 NVIDIA Studio wan only available for windows when I did this lesson. So i use the environmentMap that came with my starter file.

// exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', (environmentMap) => {  // 2 Params ⮕ 1. The path to the image. 2. Callback function is called when the environment is loaded.
//     // Set the mapping type to EquirectangularReflectionMapping so it wraps correctly around the scene
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping

//     // Set the loaded EXR as the scene's background (visible behind objects)
//     scene.background = environmentMap
//      // Set the EXR as the environment map used for reflections and lighting
//     scene.environment = environmentMap
// })


//* SkyBox
// ====== LDR Equirectangular ======

// Load a JPG texture using the standard texture loader.
// This texture is an equirectangular panoramic image that can be used for realistic lighting and reflections.
// const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/digital_painting_neon_city_night_orange_lights_.jpg')
// // Set the texture mapping type to EquirectangularReflectionMapping. This tells Three.js to wrap the image 360° around the scene like a skybox.
// environmentMap.mapping = THREE.EquirectangularReflectionMapping
// // Set the color space of the texture to sRGB to ensure correct color rendering on screen
// environmentMap.colorSpace = THREE.SRGBColorSpace
// // Set the loaded texture as the scene's background (visible behind the objects)
// scene.background = environmentMap
// // Apply the environment map for lighting and reflections on materials that support it (like MeshStandardMaterial)
// scene.environment = environmentMap
    

// ====== Ground Projected Skybox ======
// Load an HDR (High Dynamic Range) environment texture using RGBELoader.
// This type of map contains rich lighting information useful for realistic reflections and lighting in 3D scenes.
// rgbeLoader.load('/environmentMaps/2/2k.hdr', (environmentMap) => {  // 2 Params ⮕ 1. File path to HDR image,  2. Callback executed when loading is complete.
    
//     // Set the mapping to EquirectangularReflectionMapping so the HDR image wraps around the scene like a 360° dome.
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping
//     scene.environment = environmentMap

//     // Instantiate a new GroundedSkybox object using the environment map.
//     // Parameters:
//     //   1. environmentMap → the HDR texture that wraps the skybox.
//     //   2. height → how high the skybox sits above the ground (in scene units).
//     //   3. radius → the radius/scale of the skybox dome.
//     const skybox = new GroundedSkybox(environmentMap, 15, 70) 
   
//     // skybox.material.wireframe = true // for debugging
    
//     // Set the vertical position of the skybox in the scene to align it above the ground.
//     skybox.position.y = 15
//     scene.add(skybox)   
// })



// =============================
// Real Time Environment Map
// =============================
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')
// Set the texture mapping type to EquirectangularReflectionMapping. This tells Three.js to wrap the image 360° around the scene like a skybox.
environmentMap.mapping = THREE.EquirectangularReflectionMapping
// Set the color space of the texture to sRGB to ensure correct color rendering on screen
environmentMap.colorSpace = THREE.SRGBColorSpace

// Set the loaded texture as the scene's background (visible behind the objects)
scene.background = environmentMap


// ====== Holy donut ======
const holyDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) }) // Basic unlit material with a custom dark reddish color (RGB values out of 255 scale)
)
holyDonut.layers.enable(1)  // Assign the donut to layer 1 so it can be rendered by a specific camera (not visible to default camera). Careful with layers—they can become confusing fast.
holyDonut.position.y = 3.5 // Lift the donut above the ground (Y-axis)
scene.add(holyDonut)


// ====== Cube Render Target ======
// Create a cube render target with 256x256 resolution using 16-bit floating point (HalfFloatType) for higher precision lighting/reflection data (e.g. for dynamic environment mapping)
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(   // Param ⮕ 1. resolution, 2.option for the render target.
    256, // Resolution of each cube face (lower = better performance). Try to keep this number as low as possible
    { type: THREE.HalfFloatType } // Use 16-bit float for better color/precision at a reasonable memory cost (prefer over full FloatType when possible). Try to use HalfFloatType as much as posible instead of FloatType
    ) 
// Use the cube render target's texture as the environment map for PBR reflections
scene.environment = cubeRenderTarget.texture


// ====== Cube Camera ======
// Create a cube camera that captures 6 directions (used for dynamic environment mapping or reflections)
const cubeCamera = new THREE.CubeCamera( // Param ⮕ 1. near, 2. far, 3. WebGLCubeRenderTarget
    0.1, // Near clipping plane
    100, // Far clipping plane
    cubeRenderTarget) // The cube render target where the camera will render the scene into a cube map

// Set the cube camera to render only objects on layer 1 (like the holyDonut)
cubeCamera.layers.set(1)



// =============================
// Torus Knot
// =============================
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0,
        metalness: 1, 
        color: 0xaaaaaa,
    })
)
torusKnot.position.x = -4
torusKnot.position.y = 4
scene.add(torusKnot)



// =============================
// Models
// =============================
gltfLoader.load(  // 2 Params ⮕ 1. The path to the model. 2. Callback function executed when the model is successfully loaded.

    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => { // Success callback: model successfully loaded
        gltf.scene.scale.set(10, 10, 10) // Scaling the whole gltf scene, because gltf.scene is the actual 3D model we need to transform.
        scene.add(gltf.scene)
    }   
)


// =============================
// Sizes
// =============================
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


// =============================
// Camera
// =============================

// ====== Base camera ======
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// ====== Controls ======
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true



// =============================
// Renderer
// =============================
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



// =============================
// Animate
// =============================
const clock = new THREE.Clock()
const tick = () =>
{
    // ====== Time ======
    const elapsedTime = clock.getElapsedTime()


    // ====== Real time environment map ======
    if (holyDonut) {  // Check if the holyDonut exists before proceeding (safety check)
        // Animate the donut by oscillating its rotation on the X axis using a sine wave. This creates a smooth back-and-forth rotation effect over time
        holyDonut.rotation.x = Math.sin(elapsedTime) * 2

        // Update the cube camera to re-capture the scene from all directions. This allows for dynamic reflections or lighting based on the latest scene state
        cubeCamera.update(renderer, scene)
    }


    // ====== Update controls ======
    controls.update()


    // ====== Render ======
    renderer.render(scene, camera)


    // ====== Call tick again on the next frame ======
    window.requestAnimationFrame(tick)
}

tick()