import * as THREE from 'three'  // This is imported from package.json file dependencies.


// CANVAS:
const canvas = document.querySelector('canvas.webgl')


//SIZES:
const sizes = {
    width: 800,
    height: 600
}

// THERE ARE 4 ELEMENTS FOR A BASIC SCENE: 

// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧ 1- SCENE: 
// Like a contianer in which we put objectScale, models, particles, lights, etc. 
const scene = new THREE.Scene() // <- Instantiate it:



// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧ 2- OBJECT: 
// can be many things like primitive geometries, imported models, particles, light, etc.

// There are 2 types of objects in Three.js that are related:
// 1- THREE.Object3D (Invisible Object)
// 2- THREE.Mesh (Visible Object)

// Mesh is a combination of 2 things:

// 1- Geometry (the shape, such as cube) 
const geometry = new THREE.BoxGeometry(1, 1, 1) // Represents in order: width, height, depth

// 2- Material (how it looks such as color) 
const material = new THREE.MeshBasicMaterial({ color: '#ff0000' }) // wireframe: true

// Create the final Mesh using the geometry and materil
const mesh = new THREE.Mesh(geometry, material) // geometry and material in the above order.

// Add the mesh to the scene.
scene.add(mesh)



// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧ 3- CAMERA: 
// Perspective Camera Class has 2 essential parameters:
// 1st -  Field of view (vertical vision angle)
// 2nd -  Aspect ratio (the width of the canvas divided by height) 

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height) 

// setting the camera's position: 
camera.position.z = 3 // Moves the camera back in the z axis to see the cube.

scene.add(camera)



// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧ 4- RENDERER: 
// Renderer is like a camera that takes a live picture of your 3D scene and shows it on a screen (the canvas).
const renderer = new THREE.WebGLRenderer({ canvas: canvas }) // 'WebGLRenderer' is a default render for webgl.
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
