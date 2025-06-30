// 🚫 glTF Viewer:
// https://gltf-viewer.donmccurdy.com/


// 📌📌📌 NOTES 📌📌📌 

// 📌 Tone mapping: 
// Tone mapping is the process of converting High Dynamic Range (HDR) colors — which can contain very bright and very dark values — into Low Dynamic Range (LDR) so they can be displayed properly on standard screens (which can’t show true HDR).
// While we are referring to HDR in the context of environment maps, in Three.js, tone mapping can still enhance realism even if the original colors aren’t truly HDR — it simulates the effect, resulting in a more cinematic and natural look.


// 📌 Aliasing:
// Aliasing is a visual artifact that occurs when high-resolution detail is represented at a lower resolution, causing jagged, stair-like edges or flickering in the image — usually along the edges of geometries.

// Environment maps can't cast shadows. To create shadows, we need to add a light source that roughly matches the lighting of the environment map and use that light to cast the shadows.



// ====== Imports ======

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'



// =============================
//          Loaders
// =============================
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

// Instantiate the GLTFLoader (used to load .gltf or .glb 3D models)
const gltfLoader = new GLTFLoader()

gltfLoader.setDRACOLoader(dracoLoader)

const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()


// =============================
//            Base
// =============================
// ====== Debug ======
const gui = new GUI()

// ====== Canvas ======
const canvas = document.querySelector('canvas.webgl')

// ====== Scene ======
const scene = new THREE.Scene()



// =============================
//     Update all materials
// =============================
const updateAllMaterials = () =>
{
    scene.traverse((child) => {
        if (child.isMesh) {

            child.castShadow = true
            child.receiveShadow = true
        }
    })
}



// =============================
//        Environment map
// =============================
// ====== Intensity ======
scene.environmentIntensity = 1
gui
    .add(scene, 'environmentIntensity')
    .min(0)
    .max(10)
    .step(0.001)

// ====== HDR (RGBE) equirectangular ======
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})



// =============================
//       Directional light
// =============================
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(-4, 6.5, 2.5)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.001).name('lightZ')

// ====== Shadows ======
// Tells the light to cast shadow
directionalLight.castShadow = true
// Sets the maximum distance the shadow camera can see (how far shadows are rendered)
directionalLight.shadow.camera.far = 15

directionalLight.shadow.normalBias = 0.027
directionalLight.shadow.bias = - 0.004

// Sets the resolution of the shadow map (higher values = sharper shadows)
// Lower mapSize (e.g., 512x512) → Blurry and softer shadows, better and faster performance
// Higher mapSize (e.g., 2048x2048) → Sharper and more detailed shadows, slower performance
directionalLight.shadow.mapSize.set(512, 512) 

gui.add(directionalLight, 'castShadow')

// These two lines elps to reduce shadow acne (self-shadowing artifacts) by applying a constant depth offset when comparing shadow map depth values.
gui.add(directionalLight.shadow, 'normalBias').min(-0.05).max(0.05).step(0.001)
gui.add(directionalLight.shadow, 'bias').min(-0.05).max(0.05).step(0.001)


// ====== Helper ======
// Creates a helper to show the directional light’s shadow camera (used for debugging and adjusting the shadow bounds)
const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightHelper)


// ====== Target ======
// Sets the position of the light's target in the scene. (the default is 0, 0, 0). DirectionalLight shines toward this target, so changing it changes the light's direction.
directionalLight.target.position.set(0, 4, 0)

// Call updateWorldMatrix() when you want to update the target’s position **just once**
// (and the target is NOT added to the scene).
directionalLight.target.updateWorldMatrix()

// Add the target to the scene when you want Three.js to automatically update
// the target’s position every frame (for multiple or continuous updates).
// scene.add(directionalLight.target)

// =============================
//            Models
// =============================

// ⚠️ IMPORTANT:
// Why we dont set colorSpace setting in gltfLoader.load for the model, but we do for the floor and wall?
// Because GLTF files contain embedded color space information, so Three.js automatically handles color space conversion when loading the model.

// ====== Helmet ======
// gltfLoader.load(
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(10, 10, 10)
//         scene.add(gltf.scene)

//         updateAllMaterials()
//     }
// )


// ====== Burger ======
gltfLoader.load(
  '/models/myBurger.glb',
  (gltf) => {
    console.log('Model loaded:', gltf)
    gltf.scene.scale.set(0.4, 0.4, 0.4)
    gltf.scene.position.set(0, 2.5, 0)
    scene.add(gltf.scene);

    updateAllMaterials()
  },
  undefined,
  (error) => {
    console.error('Error loading model:', error)
  }
)

// =============================
//            Floor
// =============================
const floorColorTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg')
const floorNormalTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png')
const floorAORoughnessMetalnessTexture = textureLoader.load('/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg')

floorColorTexture.colorSpace = THREE.SRGBColorSpace

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        normalMap: floorNormalTexture,
        aoMap: floorAORoughnessMetalnessTexture,
        roughnessMap: floorAORoughnessMetalnessTexture,
        metalnessMap: floorAORoughnessMetalnessTexture,
    })
)
floor.rotation.x = - Math.PI /2
scene.add(floor)



// =============================
//            Walls
// =============================
const wallColorTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg')
const wallNormalTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png')
const wallAORoughnessMetalnessTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        normalMap: wallNormalTexture,
        aoMap: wallAORoughnessMetalnessTexture,
        roughnessMap: wallAORoughnessMetalnessTexture,
        metalnessMap: wallAORoughnessMetalnessTexture,
    })
)
wall.position.y = 4
wall.position.z = -4
scene.add(wall)



// =============================
//            Sizes
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
//            Camera
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
//            Renderer
// =============================
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true, // Fixes the jagged, stair-like edges of the image.
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// ====== Tone mapping ======
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.LinearToneMapping,
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)


// ====== Physically accurate lighting ======
renderer.useLegacyLights = false
gui.add(renderer, 'useLegacyLights')


// ====== Shadows ======
// Turns on shadow support — required for any shadows to show in the scene
renderer.shadowMap.enabled = true 
// Use soft shadows (PCF = Percentage Closer Filtering) for more realistic results
renderer.shadowMap.type = THREE.PCFSoftShadowMap



// =============================
//            Animate
// =============================
const tick = () =>
{
    // ====== Update controls ======
    controls.update()

    // ====== Render ======
    renderer.render(scene, camera)

    // ====== Call tick again on the next frame ======
    window.requestAnimationFrame(tick)
}

tick()