
//! NOTES:
// Finding the right solution to handle shadows is up to us. 
// It depends on the project, the performances and the techniques we know. We can also combine them.

// How Shadows Work in Three.js:
// When you do one render, Three.js will first do a render for each light supposed to cast shadows. 
// Those renders will simulate what the light sees as if it was a camera.
// During these lights renders, MeshDepthMaterial replaces all meshes materials.
// The results are stored as textures and named shadow maps.

// Shadow map:
// When you shine a light that casts shadows in Three.js, the shadow of the objects in the scene is recorded 
// in a texture, called a shadow map. Three.js then uses the shadow map to determine which parts of the scene 
// are in shadow when rendering the final image.

// How to set up?
// We tell our renderer to handle shadow map by adding the line below inside our renderer.
// renderer.shadowMap.enabled = true

// Only the following types of lights are supported by shadows
//  - PointLight
//  - DirectionalLight
//  - SpotLight


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Textures
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')

// White parts represnt visible shadow and the balck parts represent invisible shadow.
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg') 

bakedShadow.colorSpace = THREE.SRGBColorSpace


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Base
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Lights
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)


// DirectionalLight shadows:
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

directionalLight.castShadow = true

// Careful when using larger shadow maps as it can impact performance, especially with larger renders or scenes.
directionalLight.shadow.mapSize.width = 1024 // The original width was 512, we multiplied it by 2 to get 1024
directionalLight.shadow.mapSize.height = 1024 // The original height was 512, we multiplied it by 2 to get 1024
console.log(directionalLight.shadow) // Can access the original map size on the console  

directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6 // Change this value to 3 to see what it does to the shadow.
// directionalLight.shadow.radius = 10 // Blurs the shadow. Does not work with "PCFSoftShadowMap"

// Shadow map algorithm --> Check out the renderer to see how to apply them.
//  - BasicShadowMap: Very performant but lousy quality
//  - PCFShadowMap: Less performant but smoother edges
//  - PCFSoftShadowMap: Less performant but even softer edges
//  - VSMShadowMap: Less performant, more constraints, can have unexpected results

// Create a CameraHelper to visualize the shadow camera of the directional light
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false // -> Set to true to see the helper
scene.add(directionalLightCameraHelper)



// SpotLight shadows:
const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024 // The original width was 512, we multiplied it by 2 to get 1024
spotLight.shadow.mapSize.height = 1024 // The original height was 512, we multiplied it by 2 to get 1024

console.log(spotLight.shadow) // Can access the original map size on the console which is 512 that we multiply it by 2
spotLight.shadow.camera.fov = 30 // Makes the shadow wider or narrower, depending on the value you set for fov.
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target) // .target is used to define the direction in which the SpotLight is pointing.

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)


// PointLight shadows:
const pointLight = new THREE.PointLight(0xffffff, 2.7)
pointLight.castShadow = true

console.log(pointLight.shadow)  // Can access the original map size on the console  
pointLight.shadow.mapSize.width = 1024 // The original width was 512, we multiplied it by 2 to get 1024
pointLight.shadow.mapSize.height = 1024  // The original height was 512, we multiplied it by 2 to get 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5


pointLight.position.set(-1, 1, 0)
scene.add(pointLight)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Materials
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)



// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Objects + cast and recieve shadows
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧

// Sphere:
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true // Determine whether an object will cast a shadow onto other objects.


// Plane:
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    // The below shadow is baked on the plane, means if we move our sphere position the shadow will not work.
    material
    // new THREE.MeshBasicMaterial({   // replace this with material above to see the result
    //     map: bakedShadow  // Creates our baked shadow.
    // })
)
plane.receiveShadow = true // Determine whether an object will receive a shadow from other objects

plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5


// Baked shadow:
// To test if our baked simpleShadow is working, we need to move our sphere.
// Check the Animate section's "update sphere" and "update shadow" below. ⬇
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        // When we want to use "alpha" or "opacity" on material, we must set transparency to true.
        transparent: true, 
        // opacity: 0.5,
        alphaMap: simpleShadow // alphaMap is when the white part is visible and the balck part is not visible.
    })
)
sphereShadow.rotation.x = - Math.PI / 2 // its half a rotation so we use PI devided by 2

// Bellow line can cause Z fighting
// occurs when two or more surfaces are so close together that the depth buffer can't determine which one should be drawn in front of the other. 
// sphereShadow.position.y = plane.position.y 

// To avoid Z fighting we move the y position 
sphereShadow.position.y = plane.position.y + 0.01


scene.add(sphere, plane, sphereShadow)

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
camera.position.z = 3
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

renderer.shadowMap.enabled = false // This will tell our renderer to handle shadow map.

// Shadow map types:
renderer.shadowMap.type = THREE.PCFSoftShadowMap // This type of shadow map does not support "radius" which is used for bluring

// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Animate
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
const clock = new THREE.Clock() // In the latest verion of three.js we have access to new version of clock called timer

const tick = () =>
{
    // elapsTime is how many seconds has been past since we loaded the page.
    const elapsedTime = clock.getElapsedTime()


    // Update sphere: 
    sphere.position.x = Math.cos(elapsedTime) * 1.5 // multiplying it will create bigger circles
    sphere.position.z = Math.sin(elapsedTime) * 1.5 
    // The code below causes the sphere to go all the way down below our plane surface 
    sphere.position.y = Math.sin(elapsedTime) 
    // The code below keeps our sphere to bounce on the surface rather than going blow the plane surface.
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3)) // Multiplying the elapseTime bounces the sphere faster.


    // Update the shadow:
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    // Changes the opacity of the shadow when the sphere jumps up so it weaker when it goes up and stronger when it goes down.
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.8


    // Update controls:
    controls.update()


    // Render:
    renderer.render(scene, camera)


    // Call tick again on the next frame:
    window.requestAnimationFrame(tick)
}

tick()

