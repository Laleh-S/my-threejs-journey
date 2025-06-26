
//todo WHERE TO FIND TEXTURES:
//  - poliigon.com
//  - 3dtextures.me
//  - arroway-textures.ch
//  - Create your own using photos and 2D software like Photoshop or even procedural textures with software like Substance Designer.


// Textures are based on images that are covering the surface of the geometry.

// MOST USED TYPES OF TEXTURES:
// Color texture: 
//   - Most simple one. 
//   - Only take the pixels of the texture and apply them to the geometry.

// Alpha texture: 
//   - Grayscale image, 
//   - White will be visible
//   - Black not visible.

// Height texture: 
//   - Grayscale image, 
//   - Move the vertices to create some relief. 
//   - Need enough subdivision to see it.

// Normal texture: 
//   - Adds small details. 
//   - Doesn't need subdivisions. 
//   - The vertices dont move, 
//   - Lure the light into thinking that the face is oriented differently. 
//   - very useful to add details with good performance as it don't need to subdivide the geometry.

// Ambient occlusion texture: 
//   - Grayscale image 
//   - Ads fake shadow in the surface's crevices. 
//   - Not physically accurate
//   - Helps to create contrast.


// Metalness texture:
//   - Grayscale image 
//   - White is metalic 
//   - Black is non-metalic 
//   - Mostly to create reflection.

// Roughness texture: 
//   - Grayscale image that 
//   - Comes with metalness 
//   - White is rough
//   - Black is smooth
//   - Mostly for light disipation


// HOW TO ACESS TEXTURES:
// Put the image in the /static/ folder and access it directly.



import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Textures
// ≋≋≋≋≋≋≋≋≋≋≋≋

//  We can't use the image directly, we must convert it into a texture.
//* --- Method for converting an image into a texture. (Recommended)
// One textureLoader can load multiple textures.
// We use a loadingManager to mutualize the events for when we want global loading progress or to be informed when everything is loaded.

const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
    console.log('onStart')
}

loadingManager.onLoad = () => {
    console.log('onLoad')
}

loadingManager.onProgress = () => {
    console.log('onProgress')
}

loadingManager.onError = () => {
    console.log('onError')
}

const textureLoader = new THREE.TextureLoader(loadingManager) // Creates a new texture loader that can load textures using a loading manager (useful for managing loading states).
const colorTexture = textureLoader.load('/textures/minecraft.png') // Loads the color texture for the material (defines the base color or appearance of the object).
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg') // Loads the alpha texture, which controls transparency (black is fully transparent, white is fully opaque).
const heightTexture = textureLoader.load('/textures/door/height.jpg') // Loads the height texture, used for bump or displacement mapping to simulate surface depth details.
const normalTexture = textureLoader.load('/textures/door/normal.jpg') // Loads the normal map texture, which simulates small surface details and how light interacts with them (e.g., bumps, grooves).
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg') // Loads the ambient occlusion texture, which darkens areas that are less exposed to light (e.g., corners, creases).
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg') // Loads the metalness texture, which defines how metallic the surface is (white is metallic, black is non-metallic).
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg') // Loads the roughness texture, which defines how rough or smooth the surface is (affects light reflection and shininess).

colorTexture.colorSpace = THREE.SRGBColorSpace; // Ensures correct color handling



//* --- Another method for converting an image to a texture (less efficient)
// const image = new Image() // Creates an empty HTML <img> element Image object in JavaScript. The image has no source, so nothing is loaded yet.

// const texture = new THREE.Texture(image) // New Three.js Texture object
// texture.colorSpace = THREE.SRGBColorSpace; // Set the correct color space

// image.addEventListener ('load', () => { // setting up an eventListener for when the image finishes loading.
//     // Once the image finishes loading, the texture updates and is ready to be used in a Three.js scene.
//     texture.needsUpdate = true
// })
// // Sets the image source, meaning the browser will start loading this image.
// image.src = '/textures/door/my.jpg'


//! UV Unwrapping:
// It's like unfolding an origami or unwrapping a candy wrapper to make it flat in 2D. 
// Each vertex has a 2D coordinate on a flat plane, usually a square.  
// A texture is placed on geometry in a specific way because of UV coordinates.

// The repeat property is vector 2 which means is 2D
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3

// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.rotation = Math.PI / 4 // one eight of the rotation
// colorTexture.center.x = 0.5 // To control the pivot point to the centre 
// colorTexture.center.y = 0.5
//! END ----- 

// Filtering:
// Smooths out textures when they are stretched or shrunk on a 3D model. 
// Without filtering, textures may look pixelated or blurry.

// Mipmapping:
// A technique that generates progressively smaller, lower-resolution versions of a texture, starting from the original size and continuing down to 1x1 pixels
// The computer picks the best version based on the object's distance, reducing blurriness and improving performance.
// Requires texture dimensions to be powers of 2 (e.g., 16x16, 32x32) to efficiently generate progressively smaller versions for better performance and reduced blurriness. No float number.

// When using THREE.NearestFilter on minFilter, we don't need mipmaps
colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter // 'NearestFilter' better for perfoemances and better frame rate.
colorTexture.magFilter = THREE.NearestFilter // Magnification filter makes the image sharp.



// TEXTURE FORMAT AND OPTIMISATION:

// When you are preparing your textures, you must keep 3 crucial elements in mind:
//  - The weight
//  - The size (or the resolution)
//  - The data

// Choose a right type of file:
//  .jpg: (lossy compression but usually lighter)  
//  .png: (lossless compression but usually heavier)

// Can use compession websites such as 'TinyPNG' or 'Basis'(its complex)  <- can have an effect on the quality of the image.

// ≋≋≋≋≋≋≋≋≋≋≋≋
// Base
// ≋≋≋≋≋≋≋≋≋≋≋≋
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// ≋≋≋≋≋≋≋≋≋≋≋≋
// Object
// ≋≋≋≋≋≋≋≋≋≋≋≋
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: colorTexture  }) // color: 0xff0000
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// ≋≋≋≋≋≋≋≋≋≋≋≋
// Sizes
// ≋≋≋≋≋≋≋≋≋≋≋≋
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


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Camera
// ≋≋≋≋≋≋≋≋≋≋≋≋
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



// ≋≋≋≋≋≋≋≋≋≋≋≋
// Animate
// ≋≋≋≋≋≋≋≋≋≋≋≋
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