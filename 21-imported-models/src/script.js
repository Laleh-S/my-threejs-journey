//TODO 
// An online 3D software editor
// Good way to test our models before spendong time and add it to the scene.
// Only works with models composed of one file
// Can just drag and drop the glTF-Binary or the glTF-Embedded duck. If it's a dark silhouette add ambient and directional light 
// https://threejs.org/editor/


//? List of file formats for models in wikipedia:
// https://en.wikipedia.org/wiki/List_of_file_formats#3D_graphics

//? List of popular formats:
// OBJ
// FBX
// STL
// PLY
// COLLADA
// 3DS
// GLTF

//? GLTF (Graphics Library Transmission Format)
// Finding a model from GLTF:
// https://github.com/KhronosGroup/glTF-Sample-Models

// Must download or clone the whole repository from github and take the files we need.


// 📌📌📌 NOTE:
// Important: -> Sometimes our OS may hide the extensions of these files. Best to use our code ediitor.

// GLTF 4 main formats:

//  1- glTF
//      - The Duck.gltf file is a JSON that you can open in your editor. It contains various information like cameras, lights, scenes, materials, objects transformations, but neither the geometries nor the textures.
//      - The Duck0.bin file is a binary that you can't read like this. It usually contains data like the geometries and all information associated with the vertices like UV coordinates, normals, vertex colors, etc.
//      - The DuckCM.png is simply the texture.
//      - Easy to edit, but uses multiple files (JSON + .bin + textures).
// When we load the Duck.gltf file, the other files should load automatically by the loader.

//  2- glTF-Binary
//      - Contains only one file, but it includes all the data that regular glTF uses like .gltf, .bin, and .png - All packed into a single .glb file.
//      - It is binary
//      - Usaully weight lighter 
//      - Easy to load because contains only one file.
//      - Hard to alter its data. It's packed into one binary file, which we can’t easily open or edit in a text editor

//  3- glTF-Draco
//      - Like the glTF default format, but the buffer data (typically the geometry) is compressed using the Draco algorithm. 
//      - Much lighter compared to glTF for example.

//  4- glTF-Embedded
//      - One file like the glTF-Binary foramt
//      - It's JSON format
//      - Heaviest of them all


// 📌📌📌 NOTE: 
// What console.log(gltf) Shows us?
// The console.log(gltf) inspects the loaded 3D model, which is a scene graph—a hierarchy of objects.

// So in the console we inspect the following:

// THREE.Group: scene
// └───Array: children <- first children
//     └───THREE.Object3D
//         └───Array: children 
//             ├───THREE.SkinnedMesh <- the fox
//             └───THREE.Bone <- the root joint


// The SkinnedMesh inside the second child should be our fox.
// We do not need the Bone (_rootJoint) if we don’t plan to manually rig or animate it.
// Both the SkinnedMesh (the fox) and the Bone are children of the same Object3D.
// Note: that Object3D has a small scale value, so we may need to scale it up.


// There are multiple ways to add our fox to the scene:
//  - Add the entire GLTF scene to our scene. This works because, even though it's called a scene, it's actually a Group.
//  - Add only the children of the GLTF scene to our scene and ignore the unused Bone.
//  - Filter the children before adding them to the scene, to remove unwanted objects like the Bone.
//  - Add only the SkinnedMesh, but this might result in incorrect scale, position, or animation.
//  - Open the model in a 3D software, remove the Bone, and export it again if it's not needed.



// 📌📌📌 NOTE:  Access Draco decoder:
// The Draco decoder is located inside:
// -> /node_modules/three/examples/jsm/libs/draco/

// To use it in our project:
// Copy the entire /draco/ folder from the path above.
// Paste it into our /static/ folder (or /public/, depending on your setup — e.g., if using Vite or another bundler).


// When to use the Draco compression:
// While we might think that the Draco compression is a win-win situation, it is not. Yes, the geometries are lighter, but first, we have to load the DRACOLoader class and the decoder. 
// Secondly, it takes time and resources for your computer to decode a compressed file that can result in a short freeze at the start of the experience, even if we are using a worker and Web Assembly code.
// We have to adapt and decide what the best solution is. If we only have one model with a 100kB geometry, we probably don't need Draco. But if we have many MB of models to load and don't care about some freezes at the start of the experience, we might need the Draco compression.


// 📌📌📌 NOTE: Why the if statement:
// When our script runs, mixer is initially set to null.
// The model loading (gltfLoader.load(...)) happens asynchronously—it takes some time to load.
// Meanwhile, the tick() function starts running immediately (it's the animation loop).
// Inside tick(), we try to run mixer.update(deltaTime), but mixer hasn't been set yet, so it's still null.

// This would cause an error like:
// Uncaught TypeError: mixer.update is not a function



// ===== Imports =====
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'



// =============================
//           Base
// =============================

// ===== Debug =====
const gui = new GUI()

// ===== Canvas =====
const canvas = document.querySelector('canvas.webgl')

// ===== Scene =====
const scene = new THREE.Scene()


// =============================
//            Models     
// =============================

// Then, we provide the path to this folder in our code:
// dracoLoader.setDecoderPath('/draco/')
// Instantiate DRACOLoader before the GLTFLoader.  
// We don’t need to prefix with THREE because DRACOLoader is directly imported above.
const dracoLoader = new DRACOLoader()

// Set the path where the Draco decoder files (draco_decoder.js, draco_wasm_wrapper.js, etc.) are located.
// This path must point to the folder that contains those decoder files.
dracoLoader.setDecoderPath('/draco/') // 📌📌📌 NOTE: See top of the page for notes about how We find and import the Draco decoder ⬆

// Instantiate the GLTFLoader (used to load .gltf or .glb 3D models)
const gltfLoader = new GLTFLoader() 

// Tell the GLTFLoader to use the DRACOLoader to decode any compressed geometry in the model
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load( // 2 Params ⮕ 1. The path to load the model. 2. The call back function that will be called when the model is loaded.
    '/models/Fox/glTF/Fox.gltf',  // Path to the .gltf file
    (gltf) => // Success callback: called once the model is successfully loaded
    {
        // 📌📌📌 NOTE: See top of the page for notes about the console.log(gltf) ⬆
        console.log(gltf) // Log the loaded glTF data structure to the console for inspection

        // After loading the fox we can see in gltf loader (console.log(gltf)) that the gltf object contains an animations property compsed of 3 animationClips. 
        // We need to create an animationMixer
        // An animationMixer is like a player associated with an object that can contain one or many animationClips
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[1])
        
        action.play()
        // Now in the tick function we have to tell the mixer to update itself

        gltf.scene.scale.set(0.025, 0.025, 0.025)

        // Add the full glTF scene to our main Three.js scene
        // This includes all meshes, lights, cameras, etc., from the glTF file.
        scene.add(gltf.scene) 
    },
)


// =============================
//            Floor
// =============================
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)


// =============================
//            Lights
// =============================
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)


// =============================
//            Sizes
// =============================
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // ===== Update sizes =====
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // ===== Update camera =====
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // ===== Update renderer =====
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// =============================
//            Camera
// =============================

// ===== Base camera =====
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// ===== Controls =====
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true



// =============================
//           Renderer
// =============================
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



// =============================
//          Animate
// =============================
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // ===== Update Mixer =====
    // 📌📌📌 NOTE: See top of the page for notes about why we need the if statement below ⬆
    if (mixer) {
        mixer.update(deltaTime)
    }
    
    // ===== Update controls =====
    controls.update()

    // ===== Render =====
    renderer.render(scene, camera)

    // ===== Call tick again on the next frame =====
    window.requestAnimationFrame(tick)
}

tick()



