//! NOTES:
// In Three.js, geometries are composed of:  
// - Vertices (points in 3D space)  
// - Faces (triangles formed by connecting three vertices, creating a surface)  
// Each face consists of exactly three vertices, forming a triangle.

// We use geometries to create meshes, but we can also use geometries to form particles. 
// Each vertex (singular of vertices) will correspond to a particle. Unlike meshes, particle do not have faces.

// We can store more data than the position in the vertices. 
// A good example would be to talk about the UV coordinates or the normals. 

//! NOTES:
// Float32Array:
// - Typed array
// - ONLY stores floats
// - Has fixed length
// - Easier to handle for the computer



import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */

// ≋≋≋≋≋≋≋≋≋≋≋≋
// Canvas
// ≋≋≋≋≋≋≋≋≋≋≋≋
const canvas = document.querySelector('canvas.webgl')


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Scene
// ≋≋≋≋≋≋≋≋≋≋≋≋
const scene = new THREE.Scene()


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Object
// ≋≋≋≋≋≋≋≋≋≋≋≋

//* BoxGeometry 
// const geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4)

// const material = new THREE.MeshBasicMaterial({ 
//     color: 0xff0000, 
//     wireframe: true  // wireframe showw all the segmaent triangles.
// }) 
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)


//* SphereGeometry
// const geometry = new THREE.SphereGeometry(1, 32, 32)

// const material = new THREE.MeshBasicMaterial({ 
//     color: 0xff0000, 
//     wireframe: true  // wireframe showw all the segmaent triangles.
// }) 
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)



//* --- BufferGeometry: ONE TRIANGLE
// const geometry = new THREE.BufferGeometry()

// // We store BufferGeometry data inside Float32Array.
// const positionsArray = new Float32Array([ // See NOTES ⬆ for Float32Array 
//     0, 0, 0, // x, y, z of first vertex
//     0, 1, 0, // x, y, z of second vertex
//     1, 0, 0  // x, y, z of third vertex
// ])
// // Convertiing the Float32Array to a BufferAtribute.⬇
// // Must provide the 3, which means each vertex consists of 3 values: x, y, and z coordinates.
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3) 

// // 'position' is the value of the attribute we are sending that it will be used inside the vertex shaders.
// geometry.setAttribute('position', positionsAttribute) // adds the BufferAttribute to our BufferGeometry




//* --- BufferGeometry: MANY TRIANGLED
const geometry = new THREE.BufferGeometry()

// First we decide howmay triangles we want:
const count = 100 // <- can change this value to get more or less triangles

// 3 * 3 because each triangle is composed of 3 vertices and each vertex has 3 cordinates: x, y, z:
const positionsArray = new Float32Array(count * 3 * 3) 

// We fill the Float3Array with random values:
for (let i = 0; i < count * 3 * 3; i++){
    // Filling the array at the y index with random values
    // Multiplying by 4 expands this range and spreading the vertices further apart.
    positionsArray[i] = (Math.random() - 0.5) * 4 // - 0.5 Will centre the our triangles. 
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3) // Each vertex consists of 3 vlues: x, y, z
geometry.setAttribute('position', positionsAttribute)


const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Controls
// ≋≋≋≋≋≋≋≋≋≋≋≋
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