// Lights are costly for performance since the GPU must compute distance, angle, and visibility.
// Try to add as few lights as possible and try to use the lights that cost less.

// Minimal cost:
//  - AmbientLight
//  - HemisphereLight

// Moderate cost:
//  - DirectionalLight
//  - PointLight

// High cost:
//  - SpotLight
//  - RectAreaLight

// Baking 
// 33:13
// A good technique for lighting is called baking. The idea is that you bake the light into the texture. This can be done in a 3D software. The downside is that, once the lighting is baked, we can't move the lights, because there are none and you'll probably need a lot of textures.

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
console.log( RectAreaLightHelper)
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

// AmbientLight: 
// Evenly illuminates all objects in the scene equally without casting shadows as it has no direction. 
// Great for light bouncing.
const ambientLight = new THREE.AmbientLight(0xffffff, 1) // First param is color, second param is the intensity.
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)



// DirectionalLight:
// A light that gets emitted in a specific direction.
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9) // First param is color, second param is the intensity.
scene.add(directionalLight)
// We know the light is shining from the light because the x value is 1
// If the x value was -1 then the light will shine from the left side.
directionalLight.position.set(1, 0.25, 0) // Represents x, y and z cordinates. 

gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001).name('AmbientLight Intensity')
gui.addColor(ambientLight, 'color').min(0).max(3).step(0.001).name('AmbientLight Color')



// HemisphereLight:
// A light source positioned directly above the scene, with color fading from the sky color to the ground color.
const hemisphereLight = new THREE.HemisphereLight(0xff0000,  0x0000ff, 0.9) // params -> skyColor, groundColor, intensity
scene.add(hemisphereLight)

// Store the original colors
const originalSkyColor = new THREE.Color(0xff0000);  // Original red sky color
const originalGroundColor = new THREE.Color(0x0000ff);  // Original blue ground color

// Add GUI for separate sky/ground color intensity multipliers
gui.add({ skyIntensity: 1 }, 'skyIntensity').min(0).max(3).step(0.001).name('Sky Color Intensity').onChange(value => {
  hemisphereLight.color.set(originalSkyColor).multiplyScalar(value);
});

gui.add({ groundIntensity: 1 }, 'groundIntensity').min(0).max(3).step(0.001).name('Ground Color Intensity').onChange(value => {
  hemisphereLight.groundColor.set(originalGroundColor).multiplyScalar(value);
});


// PointLight:
// Gets emitted from a single point in all directions. Replicate the light emitted from a bare lightbulb.
// Distance: Controls how far the light can affect objects. 
// Decay: Controls how quickly the light's intensity decreases with distance.
const pointLight = new THREE.PointLight( 0xff9000, 0.5, 3) // params -> color, intensity, distance, decay
pointLight.position.set(1, - 0.5, 1)
scene.add(pointLight)

gui.add(ambientLight, 'intensity')




// RectAreaLight:
// RectAreaLight emits light uniformly across the face a rectangular plane. 
// Used to simulate light sources such as bright windows or strip lighting.
// Only works with "MeshStandardMaterial" and "MeshPhisicalMaterial"
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1) // params -> color, intensity, width of the plane, height of the plane.

// How to position it ???
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3()) // Empty vector3 represents 0, 0, 0, params
scene.add(rectAreaLight)


// SpotLight:
// Emits light from a single point in a specific direction, forming a cone that widens as it extends further from the source.
// distance - Maximum range of the light. Default is 0 (no limit).
// angle - Controls the cone width, with a max limit of Math.PI / 2 (90°).
// penumbra -  Controls how soft the edges of the light cone are. A value of 0 makes sharp edges, while higher values make them softer.
// decay - Controls how quickly the light's intensity decreases with distance.
const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1) // params -> color, intensity, distance, angle, penumbra, decay
spotLight.position.set(1, 2, 3)
scene.add(spotLight)

spotLight.target.position.x = -1.75
scene.add(spotLight.target) // The target of the SpotLight is an independent object, and it needs to be part of the scene for the light direction to be properly calculated.



// Helpers for lights:
// first parameter to provide the light that is concerned.
// Secons parameter is the size of the helper
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2) 
scene.add(hemisphereLightHelper) 

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2) 
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2) 
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight) // spotlight doesnt have the size parameter
scene.add(spotLightHelper)

// RectAreaLightHelper is not part of the THREE variable and We must import it.
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight) // Doesnt have the size parameter
scene.add(rectAreaLightHelper)

// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Objects
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧

// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()