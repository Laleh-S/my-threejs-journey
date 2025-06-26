//! Note:
// THREE.Vector3 represents a 3D point or 3D direction using x, y, z coordinates.

//! Note:
// Classes like Mesh and PerspectiveCamera inherit position, scale, rotation, and quaternion from Object3D.
// This lets us move, resize, and rotate them in the scene.

//! Note:
// In Three.js, we concider:
// Y-axis -> upwardr (+Y) down(-Y) -> Red
// X-axis -> right (+X) left(-X) -> Green 
// z-axis -> forward, zoomin (+Z) backward, zoomout(-Z) -> Blue



import * as THREE from 'three'


//▧▧▧▧▧▧▧ Canvas
const canvas = document.querySelector('canvas.webgl')


//▧▧▧▧▧▧▧  Sizes
const sizes = {
    width: 800,
    height: 600
}



// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
//  Scene
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
const scene = new THREE.Scene()



// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
//  Objects
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧

// Ungroup:
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)


// Group:
// When building a house for example, instead of scaling each object individually, we group them. 
// We then scale the entire structure at once for easier management.

const group = new THREE.Group()
scene.add(group)
group.position.y = 1
group.scale.y = 2
group.rotation.y = 1


const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
group.add(cube1)


const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.x = -1.5
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.x = 1.5
group.add(cube3)




// 4 PROPERTIES TO TRANSFORM OBJECTS IN OUR SCENE: -> (Always add them to the scene)

// 1 - POSITION (Moves the object in 3D space) -> Object and Vector3 
// mesh.position.x = 1 // <- This number can be in centimeter, meter, or kilometer. Depends on what we are building.
// mesh.position.y = -3
// mesh.position.z = -2
// mesh.position.set(0.7, - 0.6, 1)


// 2 - SCALE (resizes the object) -> Object and Vector3 
// mesh.scale.x = 2
// mesh.scale.y = 0.5
// mesh.scale.z = 0.5
// mesh.scale.set(2, 0.5, 0.5)


// 3 - ROTATION (rotate the object using Euler angles) -> Euler

// First decide in what axes we want to rotate our object.
// Concider rotation axex order to avoid gimble lock.
// mesh.rotation.reorder('YXZ') 
// mesh.rotation.y = Math.PI * 0.25 // represents the ratio of a circle's circumference to its diameter
// mesh.rotation.x = Math.PI * 0.25 


// 4 - QUATERNION (rotate the object using quaternions (more advanced and avoids gimbal lock))
// Quaternion updates when you change the rotation.


//! Note:
// If building a house with walls, doors, windows, etc., instead of scaling each object individually, 
// you can group them into a container (a Group). 
// We then, move or scale the entire group at once, making it easier to manage and adjust the whole structure.


// Axes helper:
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)



// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
//  Camera 
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// camera.position.x = 1
// camera.position.y = 1
camera.position.z = 3 
scene.add(camera)

// mesh.position.normalize()


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
//  Rendere
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Renderer is like a camera that takes a live picture of your 3D scene and shows it on a screen (the canvas).
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)