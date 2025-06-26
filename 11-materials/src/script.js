//todo:  Matcap sources
// https://github.com/nidorx/matcaps
// Kevin Chapelier built: https://www.kchapelier.com/matcap-studio/:
// create your own using a 3D software like blender

//todo: Environment maps
// https://polyhaven.com/

//todo: List of ior "Index Of Refraction"
// https://en.wikipedia.org/wiki/List_of_refractive_indices

// Make sure you have the lisence to used the above materials if its not for personal use.


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Debug
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
const gui = new GUI()


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Base
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Textures
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧

const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace; // Ensures correct color handling
matcapTexture.colorSpace = THREE.SRGBColorSpace; // Ensures correct color handling



// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Object
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧

//* MeshBasicMaterial 
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture 

// When chanding the color property directly, you must instantiate a color class
// material.color = new THREE.Color('#FFFF00')
// material.wireframe = true

// The opacity property controls transparency, we must change the transparency to true
// material.transparent = true
// material.opacity = 0.3

// material.alphaMap = doorAlphaTexture  // whites are visible, blacks are hidden

// The 'side' decides which side of the faces are visible:
//  - frontSide (default)
//  - backSide
//  - doubleSide (avoid using doubleSide when possible, it required more prossesing power)
// material.side = THREE.DoubleSide


//* MeshNormalMaterial
// Displays a purple blueish color similar to normal texture we saw in door textures above. both related to normal.
//  A 'normal' is an invisible arrow that sticks out at a 90-degree angle from a surface.
// In MeshNormalMaterial, the color of each face is based on the direction of these arrows.

// Used for:
//  - lighting
//  - surface orientation
//  - colors based on the surface direction
//  - shadows
//  - debuging the normal, for example to test if the lighting is used as it should, we can activate MeshNormalMaterial

// const material = new THREE.MeshNormalMaterial()
// material.wireframe = true
// material.flatShading = true


//* MeshMatcapMaterial
// Needs a reference texture that looks like a sphere
// Gives an object a shiny look using a texture that simulates lighting and shading illusion without actual lighting calculation.

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture


//* MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial()


//* MeshLambertMaterial
// MeshLambertMaterial is the most performant material that uses light
// Check out the lighting set up down the page
// Supports the same properties as MeshBasicMaterial
// Supports some properties related to lights
// The parameters are not very convenient and can cause strange patterns in the geometry of sphere for example.
// const material = new THREE.MeshLambertMaterial()


//* MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x2288ff)


//* MeshToonMaterial
// By default, we only get a two-part coloration(one for light and one for shadow)
// const material = new THREE.MeshToonMaterial()

// This controls how the texture will be sampled when it's minified
// gradientTexture.minFilter = THREE.NearestFilter

// This controls how the texture will be sampled when it's magnified
// gradientTexture.magFilter = THREE.NearestFilter

// Mipmaps are precomputed smaller versions of the texture for better performance at various distances.
// Setting this to false means no smaller textures will be used, and the texture will always be shown at its original size.
// gradientTexture.generateMipmaps = false 
// material.gradientMap = gradientTexture


//* MeshStandardMaterial -> (Most realistic material)
// Used to create materials that are based on a physically-based rendering (PBR) model, which means they simulate real-world lighting and surface interactions. 
// Used for creating realistic materials, such as wood, skin, plastic, metal, or stone, that react to lights in a lifelike manner.
// Key features: metalness, roughness, color
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 1
// material.roughness = 1

// The map property allow us to apply a simple texture.
// material.map = doorColorTexture

// The aoMap sets the ambient occlusion map for the material.
// Defines areas where shadows should appear in crevices and corners.
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1 // Intentifies the crevices and corners

// The doorHeightTexture is a grayscale image where white represents high areas and black represents low areas.
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1

// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)

// material.transparent = true
// material.alphaMap = doorAlphaTexture

// gui.add(material, 'metalness').min(0).max(1).step(0.0001)
// gui.add(material, 'roughness').min(0).max(1).step(0.0001)



//* MeshPhysicalMaterial -> (Most realistic material) <- The upgraded version of MeshStandardMaterial
// Same to MeshSyandardMaterial but with support of additional effects
// Inherites from MeshSyandardMaterial
// Features: clearcoat, sheen, iridescence, transmision
const material = new THREE.MeshPhysicalMaterial()
material.metalness = 0
material.roughness = 0

// The map property allow us to apply a simple texture.
// material.map = doorColorTexture

// // The aoMap sets the ambient occlusion map for the material.
// // Defines areas where shadows should appear in crevices and corners.
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1 // Intentifies the crevices and corners

// // The doorHeightTexture is a grayscale image where white represents high areas and black represents low areas.
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1

// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)

// material.transparent = true
// material.alphaMap = doorAlphaTexture

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

//? All the properties used above are the same we used for MeshSyandardMaterial. 
//? As well as the above properties, the bellow are the properties belonging to MeshSPhysicalMaterial.

// Clearcoat 
// Simulates a thin, transparent glossy layer on top of a material, like the coating on a polished wood.
// material.clearcoat = 1
// material.clearcoatRoughness = 0
// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001)
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001)

// // Sheen:
// // Simulate soft, fabric-like reflections, such as velvet, satin, or certain plastics.
// material.sheen = 1
// material.sheenRoughness = 0.25
// material.sheenColor.set(1, 1, 1)

// gui.add(material, 'sheen').min(0).max(1).step(0.01)
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.01)
// gui.addColor(material, 'sheenColor')


// Iridescence
// Simulates color shifts depending on the viewing angle, like soap bubbles, oil puddle, or certain beetle shells.
// material.iridescence = 1
// material.iridescenceIOR = 1
// material.iridescenceThicknessRange = [100, 800]
// gui.add(material, 'iridescence').min(0).max(1).step(0.0001)

// // Going below 1, the material becomes physically unrealistic. 
// // Going above 2.333, the material is uncommon in nature but may still exist in synthetic or engineered forms
// gui.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001) 
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1).name('Thickness min') // tweaks the 1st value of the array  '100'
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1).name('Thickness max') // tweaks the 2nd value of the array '800'


// Transmission
// Controls how much light passes through a material, simulating glass-like transparency. Like seeing through glass.
material.transmission = 1
material.ior = 1.5
material.thickness = 0.5

gui.add(material, 'transmission').min(1).max(2.333).step(0.0001) 

// ior stands for "Index Of Refraction" and depends on the type of material we want to simulate.
// for diamond: 2.417 ior
// for water: 1.333 ior
// for air: 1.000293
// find the whole list on Wikipedia https://en.wikipedia.org/wiki/List_of_refractive_indices
gui.add(material, 'ior').min(1).max(2.333).step(0.0001) 
// Going above 2.333, the material is uncommon in nature but may still exist in synthetic or engineered forms
gui.add(material, 'thickness').min(0).max(1).step(0.0001) // The thickness of the object!



const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)


const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Lights
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// const ambientLight = new THREE.AmbientLight(0xffffff, 1) // first parameter is color and second the intensity
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 100)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Environment Map
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Is an image (often a 360-degree or a cubemap) that surrounds the scene, giving the appearance of lighting and reflections from all directions.
// Compatible with 'MeshLambertMaterial' and 'MeshPhongMaterial'
// Because environmentMap contributes to lighting, we can remove or comment out the 'ambientLight' and 'pointLight'
const rgbeLoader = new RGBELoader() // The instance of RGBELoader

// Load the HDR environment map from the specified path.
// The load function takes two arguments:
// - The path to the HDR image (in this case, './textures/environmentMap/2k.hdr')
// - A callback function that is executed once the environment map is loaded.
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => { //  The 'environmentMap' parameter is the loaded HDR texture passed as a parameter to the callback function
    //?  -> Adjust the metalness and roughness in debug UI to see how these effects are working
    
    // Set the mapping type for the environment map (equirectangular mapping for 360-degree textures)
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    // Set the environment map as the scene background (applies the texture as the background)
    scene.background = environmentMap

    // Set the environment map as the scene's environment, affecting lighting and reflections
    scene.environment = environmentMap
})


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
camera.position.z = 6
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = - 0.15 * elapsedTime
    plane.rotation.x = - 0.15 * elapsedTime
    torus.rotation.x = - 0.15 * elapsedTime


    // Update controls
    controls.update()
    

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()