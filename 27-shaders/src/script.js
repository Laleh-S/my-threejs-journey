 
// Coordinate Systems
// 🔗🔗🔗  https://learnopengl.com/Getting-started/Coordinate-Systems

// Shaderific for OpenGL - Documantation of an iOS application to do shaders
// 🔗🔗🔗  https://shaderific.com/glsl.html

// Book of Shaders glossary - A good course about fragment shaders
// 🔗🔗🔗  https://thebookofshaders.com/

// ShaderToy:
// 🔗🔗🔗  https://www.shadertoy.com/

// The Art of Code Youtube Channel: 
// 🔗🔗🔗  https://www.youtube.com/channel/UCcAlTqd9zID6aNX3TzwxJXg

// kishimisu
// 🔗🔗🔗 https://www.youtube.com/watch?v=f4s1h2YETNY


// 📌📌📌 Shader language:
// It is called GLSL (OpenGL Shading Language). It's a high-level shading language with a syntax based on the C programming language.

// Things to have in mind for GLSL language:
//  - It is not possible to log something on the console.
//  - Indentations are not important
//  - The semicolons are very impoertant, missing them causes error on the terminal.
//  - It is a type-based language.
//  - GLSL does not allow operations between float and int types unless you explicitly convert one to match the other.
//      float a = 1.0;
//      int b = 2;
//      float c = a + b; // ❌ Error: cannot add float and int directly
//      float c = a + float(b); // ✅ Correct: convert int to float

//  - Can’t create an uninitialized vec2, in GLSL using vec2(); we must initialize it with values like vec2(0.1, 0.2).
//  - After initializing a vec2 with values like vec2(0.1, 0.2), we can update its components later by assigning new values.

//  - When multiplying a vec2 by a number, it multiplies both the x and y parts by that number.
//      vec2 myVec = vec2(2.0, 3.0);
//      vec2 result = myVec * 2.0;  // ->  result is (4.0, 6.0)

//  - Can't create empty vec3() or vec4()
//  - For vectors like vec3 and vec4, you can use r, g, b, and a instead of x, y, z, and w. We can use r and g for vec2 — it’s just less common because vec2 is often used for texture coords or positions (where x and y are typical)

//  - We can create a vec3 from a vec2L, but we have to provide the third component ourselves because vec2 only has two components.
//      vec2 myFirstV2 = vec2(1.0, 2.0);
//      vec3 myNewvUpdated3 = vec3(myFirstV2, 3.0); // -> creates (1.0, 2.0, 3.0)

//  - We can also create a vec2 from a vec3 
//      vec2 myVec2 = myVec3.xy; // ->  taking x and y from vec3. Taking x and y component from a vec3 is called swizzling.
//  - but, can't do this irectly: 
//      vec2 myVec2 = vec2(myVec3); // ❌ error, GLSL needs two components explicitly



// 📌📌📌 What is a shader?
// A shader is a small program written in GLSL that runs on the GPU (Graphics Processing Unit).
// It controls how vertices and pixels (fragments) are processed and ultimately how objects are rendered on the screen.

// There are two main types of shaders:
//  1 - Vertex shader: positions each vertex of a geometry.
//  2 - Fragment (pixel) shader: determines the color of each visible pixel on the geometry. Fragment is a potential pixel


// 📌📌📌 What is a Fragment:
// When the GPU draws something, it breaks the shape into lots of tiny pieces called fragments. Each fragment holds information like color, brightness, and depth for a spot on the screen.
// But a fragment isn’t automatically shown on the screen — it’s just a candidate. The GPU runs tests (like checking if something is hidden behind another object) to decide if that fragment actually becomes a visible pixel.
// So, a fragment is a possible pixel that might turn into a real pixel after these checks.


// 📌📌📌 Attributes and Uniforms?
//  - Attributes: are pieces of information that change for each point (vertex) of a shape. For example, each corner of a triangle might have a different position or color.
//  - Uniforms: are pieces of information that stay the same for the whole shape while it’s being drawn. For example, how big the shape is or where the light is.

// The difference:
//  – Attributes: is the value that change per vertex (each point can be different).
//  – Uniforms: is the value that stay the same for all vertices (one value for the whole shape).

// Varying or out/ in:
// The data that goes from the vertex shader to the fragment shader is called: varying in older GLSL versions
// out (in vertex) and in (in fragment) in modern GLSL


// 📌📌📌  ShaderMaterial and RawShaderMaterial:
// ShaderMaterial: comes with common GLSL code and built-in variables provided by Three.js, making it easier to write custom shaders.
// RawShaderMaterial: provides no extras — we must write all GLSL code manually from scratch.

// 📌📌📌  Void function:
// A void function in GLSL is a function that does not return any value.  
//  - To organize our shader code into smaller parts.
//  - Helps keep our shader code cleaner and easier to read.
//  - To run code that change things but doesn’t need to send back a value.


// 📌📌📌  ShaderMaterial, RawShaderMaterial:
// 🔷 ShaderMaterial
//  - Three.js helps us by injecting common GLSL variables.
//  - Convenient for most custom shader work.
//  - We don’t need to write boilerplate like attribute vec3 position; or uniform mat4 modelViewMatrix;.
//  - Automatically provides things like: position, normal, uv, modelMatrix, viewMatrix, projectionMatrix And others...
// Think of it as “custom shaders with Three.js setup included.

// ❗️ You don't need to declare attributes or matrices
// void main() {
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }


// 🔶 RawShaderMaterial
//  - Three.js gives you nothing by default.
//  -  must write 100% of the GLSL boilerplate yourself.
//  - Declare our own attributes, uniforms, varyings, etc.
//  - Useful when you want full control over your GLSL code.
//  - Often used when porting shaders from outside of Three.js (like ShaderToy, Unity, etc.).
// Think of it as “you’re on your own — full raw WebGL shader.

// ❗️ You MUST declare everything yourself
// attribute vec3 position;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;

// void main() {
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

// Import  custom shaders written in GLSL (used by RawShaderMaterial below). Created seperately inside the shaders/test folder. 
// Must install by running "npm install vite-plugin-glsl" also need to adjust the "vite.congig file" 
import testVertexShader from './shaders/test/vertex.glsl' 
import testFragmentShader from './shaders/test/fragment.glsl'


// =============================
//             Base
// =============================
// ====== Debug ======
const gui = new GUI()


// ====== Canvas ======
const canvas = document.querySelector('canvas.webgl')

// ====== Scene ======
const scene = new THREE.Scene()


// =============================
//            Textures
// =============================
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/textures/flag-iran.jpg')



// =============================
//          Test mesh 
// =============================
// ====== Geometry ======
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
/// Useful when working with shaders to see available attributes like position, uv, normal, etc.
console.log(geometry)

// Gets the number of vertices — used to assign custom attributes (like randomness) for the shader
const count = geometry.attributes.position.count

// Creating a custom attribute to be used in shaders
const randoms = new Float32Array(count)  
for (let i = 0; i < count; i ++) {
    randoms[i] = Math.random()
}
// Add a custom attribute "aRandom" for each vertex — can be accessed in the vertex shader
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

// ====== Material ======
// 📌📌📌 NOTE: See top of the page for notes about "ShaderMaterial" and "RawShaderMaterial" ⬆
// Using RawShaderMaterial means you write ALL the shader logic from scratch in GLSL
const material = new THREE.ShaderMaterial({
    
    // Custom vertex and fragment shader files
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    // transparent: true,  // allows the fragment shader's rgba alpha to control transparency
    // wireframe: true,
    // side: THREE.DoubleSide  // Makes both front and back faces visible

     // Custom uniforms — global variables you send into the shader
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },  // Used for oscillation or deformation
        uTime: { value: 0 },   // Animation over time
        uColor: { value: new THREE.Color('orange') },  // A base color
        uTexture: { value: flagTexture }  // Texture image to sample in fragment shader
    }
})

// GUI controls for tweaking shader uniform values in real time
gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequency-X')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequency-Y')

// ====== Mesh ======
// The mesh uses the custom shader material and geometry that works with it
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2/3
scene.add(mesh)



// =============================
//             Sizes
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
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)


// ====== Controls ======
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



// =============================
//            Renderer
// =============================
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// =============================
//             Animate
// =============================
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime() // How many seconds have passed since the clock was started

    // ====== Update material ======
    // Update the time uniform — allows the shader to animate over time
    material.uniforms.uTime.value = elapsedTime

    // ====== Update controls ======
    controls.update()

    // ====== Render ======
    renderer.render(scene, camera)

    // ====== Call tick again on the next frame ======
    window.requestAnimationFrame(tick)
}

tick()