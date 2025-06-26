// todo: Finding and adding textures:
//  - Find a good place with nice textures. 
//  - Make sure we are allowed to use them. 
//  - Download and optimize them.
//  - Apply them to the object with a different approach depending on how textures are mapped. Etc.

// todo: Texture libraries:
// https://www.notion.so/brunosimon/Assets-953f65558015455eb65d38a7a5db7171?pvs=4

// todo: Poly Haven free texture:
// https://polyhaven.com/

// todo: Katsukagi 3D Textures
// https://3dtextures.me/author/gendosplace/

// todo: door texture
// https://3dtextures.me/2019/04/16/door-wood-001/

//todo: Desmos.com/calculator  -> for Ghost movement patern
// One sine:
// https://www.desmos.com/calculator/2z8cxqtttz

// Two sine:
// https://www.desmos.com/calculator/morzycytgz

// Three sine:
// https://www.desmos.com/calculator/1rnripshdv

//todo: Code for the sky 
// https://threejs.org/examples/?q=sky#webgl_shaders_sky

//todo: Tools to compress images:
// Squoosh
// https://squoosh.app/

// CloudConvert
// TinyPNG


// NOTES:
// One unit in Three.js can mean anything we want. Imagine we are creating a considerable landscape to fly above. 
// In that case, we might think of one unit as one kilometer. 
// If we are building a house, we might think of one unit as one meter, and if we are making a marble game, we might think of one unit as one centimeter.
// Having a specific unit ratio will help us create geometries. Let's say we want to make the door. We know that a door is slightly taller than us, so it should reach around 2 meters.

// In this project, 1 unit is 1 meter.

// Z-fighting: 
// Occurs when two surfaces occupy the same or nearly the same position in 3D space, and the GPU can't decide which one to draw in front 


//! Important NOTE FOR THIS PROJECT
// textures can slow down loading times, use up too much GPU memory, and cause freezes during loading. To avoid this:
// Converting JPG to WebP and resize the images.

// door/: size 1024, quality to 80
// floor/: size 512, quality 80 (and compress the alpha.jpg the same way)
// grave/: set 512, quality 80
// roof/: set 512, quality 80
// wall/: set 1024, quality 80



import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

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
// Textures
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
const textureLoader = new THREE.TextureLoader() // One textureLoader used for all textures.

// Floor:
const floorAlphaTexture = textureLoader.load('/floor/alpha.jpg') // Not using ./ because my image is not in the same folder as my script.js. 
const floorColorTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp')
const floorArmTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp')
const floorNormalTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')

// Always use "SRGBColorSpace" to Optimizes color textures.
floorColorTexture.colorSpace = THREE.SRGBColorSpace

// The" repeat" property is vector 2 and controls how many time the texture repeats for our surface.
floorColorTexture.repeat.set(8, 8)  // → Repeat 8 times horizontally (U) and 8 times vertically (V)
floorArmTexture.repeat.set(8, 8)
floorDisplacementTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)


// wrapS controls how the texture wraps horizontally (along the U axis).
// wrapT controls how the texture wraps vertically (along the V axis).
floorColorTexture.wrapS = THREE.RepeatWrapping
floorArmTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorArmTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping


// Wall:
const wallColorTexture = textureLoader.load('/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp')
const wallArmTexture = textureLoader.load('/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp')
const wallNormalTexture = textureLoader.load('/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp')

// Use "SRGBColorSpace" to Optimizes color textures.
wallColorTexture.colorSpace = THREE.SRGBColorSpace


// Roof:
const roofColorTexture = textureLoader.load('/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp')
const roofArmTexture = textureLoader.load('/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp')
const roofNormalTexture = textureLoader.load('/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp')

// Use "SRGBColorSpace" to Optimizes color textures.
roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(3, 1) // Asking the texture to repeat 3 times horizontally (U) and 1 times vertically (V)
roofArmTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

// We only use wrapS for roof. We are not repeationg the vertical value. 
// Don’t need wrapT when verticl repeat values are less than 1  -> .repeat(3, 1)
// But if we ever set .repeat(3, 2) or anything above 1 on the vertical
roofColorTexture.wrapS = THREE.RepeatWrapping // Controls how the texture wraps horizontal
roofArmTexture.wrapS = THREE.RepeatWrapping // Controls how the texture wrapT vertical
roofNormalTexture.wrapS = THREE.RepeatWrapping


// Bush:
const bushColorTexture = textureLoader.load('/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
const bushArmTexture = textureLoader.load('/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
const bushNormalTexture = textureLoader.load('/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')

// Use "SRGBColorSpace" to Optimizes color textures.
bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 1) // Asking the texture to repeat 2 times horizontally (U) and 1 times vertically (V)
bushArmTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)

// We only use wrapS for bush.
// Don’t need wrapT when verticl repeat values are less than 1 -> .repeat.set(2, 1) 2 is horizontal, 1 is vertical
// But if we ever set .repeat(3, 2) or anything above 1 on the vertical
bushColorTexture.wrapS = THREE.RepeatWrapping // Controls how the texture wraps horizontal
bushArmTexture.wrapS = THREE.RepeatWrapping // Controls how the texture wrapT vertical
bushNormalTexture.wrapS = THREE.RepeatWrapping



// Grave 
const graveColorTexture = textureLoader.load('/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp')
const graveArmTexture = textureLoader.load('/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp')
const graveNormalTexture = textureLoader.load('/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp')

// Use "SRGBColorSpace" to Optimizes color textures.
graveColorTexture.colorSpace = THREE.SRGBColorSpace

// Don’t need WrapS and wrapT when repeat values are less than 1 
graveColorTexture.repeat.set(0.3, 0.4) // Asking the texture to repeat 0.3 times horizontally (U) and 0.4 times vertically (V)
graveArmTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)


// Door:
const doorColorTexture = textureLoader.load('/door/color.jpg') // Defines the base color or appearance of the door (like the door's surface image).
const doorAlphaTexture = textureLoader.load('/door/alpha.jpg') // Defines the transparency of the door, where black is fully transparent and white is fully opaque.
const doorAmbientOcclusionTexture = textureLoader.load('/door/ambientOcclusion.jpg') // Adds ambient occlusion (AO) effects, which simulate how light is less likely to reach certain areas (like corners or creases).
const doorHeightTexture = textureLoader.load('/door/height.jpg') // Defines surface height details for bump mapping or displacement mapping, simulating small depth details on the door.
const doorNormalTexture = textureLoader.load('/door/normal.jpg') // Used for normal mapping, simulating small surface details (like bumps or grooves) without altering the geometry.
const doorMetalnessTexture = textureLoader.load('/door/metalness.jpg') // Defines how metallic the surface is, where white means metallic and black means non-metallic.
const doorRoughnessTexture = textureLoader.load('/door/roughness.jpg') // Defines how rough or smooth the surface is, affecting how light interacts with it (shininess).

doorColorTexture.colorSpace = THREE.SRGBColorSpace


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// House / Object
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧

// Floor:
// 0 on the y axis will represents floor level.
const floor = new THREE.Mesh(
    // PlaneGeometry is made up of vertices — little points that define the shape of the surface.
    new THREE.PlaneGeometry(20, 20, 100, 100), // Adds enough vertices (100x100) to support displacement mapping — but not too many to hurt performance.
    // It's not good for performance to add extremely dense geometry like 1000+ segments; instead, we rely on normalMap for visual detail without extra vertices.
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true, // Must be set to true when using alphaMap or transparency in general
         map: floorColorTexture, // Base color texture (diffuse map), gives the object its main colors
         aoMap: floorArmTexture, // Ambient Occlusion map, adds soft shadows in cracks and corners to enhance realism
         roughnessMap: floorArmTexture, // Roughness map, defines how rough the surface is (black = smooth, white = rough)
         metalnessMap: floorArmTexture, // Metalness map, defines which parts are metallic (white = metal, black = non-metal)
         normalMap: floorNormalTexture, // Normal map, simulates surface detail (bumps, grooves) without modifying geometry
         displacementMap: floorDisplacementTexture, // Displacement map physically moves vertices up/down to add real surface depth
         displacementScale: 0.3, // Controls how strong the displacement effect is — 1 = strong, 0.3 = subtle bumps
         displacementBias: -0.2 // Offsets the displacement effect. A negative value moves vertices down (toward the surface), while positive moves them up.
    })
)
// If adding displacementMap the door still looks flat, it means we need to add more vertices to planeGeometry.
// So we add (100x100) in planeGeometry.

// By default, THREE.PlaneGeometry is created standing up vertically, like a wall. But we want it to be flat — like the ground we walk on.
// Math.PI is 180 degrees.
// So Math.PI * 0.5 is 90 degrees.
// The negative sign means we rotate clockwise around the X-axis.
floor.rotation.x = - Math.PI / 2 // Rotates the floor by 90 degrees, so it's lying flat like the ground.
scene.add(floor)

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')


// House Container:
// For house we are creating a group:
// Group is a container that allows us to organize multiple objects together and apply transformations (like moving or scaling) to them as a whole. 
const houseGroup = new THREE.Group()
scene.add(houseGroup)


// Walls:
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4), // x, y, z
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallArmTexture,
        roughnessMap: wallArmTexture,
        metalnessMap: wallArmTexture,
        normalMap: wallArmTexture,
    })
)
// When we create a BoxGeometry its center (pivot/origin) is at (0, 0, 0), meaning:
// Half of the box's height extends below the y = 0 level. The other half extends above it.
// Therefore the walls are halfway buried in the floor. To fix that:
walls.position.y += 2.5 / 2 // The 2.5 comes from the BoxGeometry's y axix which represents the height.
houseGroup.add(walls)


// Roof:
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofArmTexture,
        roughnessMap: roofArmTexture,
        metalnessMap: roofArmTexture,
        normalMap: roofArmTexture,
    })
)
roof.position.y = 2.5 + 0.75 // 2.5 is the size of the wall and 0.75 is half of the roof height which is 1.5 / 2 
roof.rotation.y = Math.PI / 4
houseGroup.add(roof)


// Door:
const door = new THREE.Mesh(
    // PlaneGeometry is made up of vertices — little points that define the shape of the surface.
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100), // Adds enough vertices (100x100) to support displacement mapping.
    // It's not good for performance to add extremely dense geometry like 1000+ segments; instead, we rely on normalMap for visual detail without extra vertices.
    new THREE.MeshStandardMaterial({
        map: doorColorTexture, // The base texture for the door color or appearance.
        transparent: true, // Must be set to true when using alphaMap or transparency, allowing the material to handle transparency.
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture, // Adds shadow details where light is less likely to reach (like corners).
        displacementMap: doorHeightTexture,
        displacementScale: 0.15, // Scales the displacement effect, adding depth to the door (increases the door's thickness visually).
        displacementBias: - 0.04, // Adjusts the position of the displaced surface, removing the gap between the door and the wall.
        normalMap: doorNormalTexture,  // Simulate small surface details and how light interacts with them (e.g., bumps and grooves).
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    })
)
// If adding displacementMap the door still looks flat, it means we need to add more vertices to planeGeometry.
// So we add (100 x 100) to our planeGeometry.
door.position.y = 1
door.position.z = 2 + 0.01 // Adding 0.01 to the value to avoid z-fighting.
houseGroup.add(door)


// Bushes:
const bushGeometry = new THREE.SphereGeometry(1, 16, 16) // params -> radius, widthSegments, heightSegments
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc', // Changed the texture color for bushes.
    map: bushColorTexture,
    aoMap: bushArmTexture,
    roughnessMap: bushArmTexture,
    metalnessMap: bushArmTexture,
    normalMap: bushArmTexture,
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5) // We set default sizes inside the "SphereGeometry" and scale it down here.
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = - 0.75 // Rotated the sphere to hide visible texture imperfection issues on the surface.

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25) // We set default sizes inside the "SphereGeometry" and scale it down here.
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = - 0.75 // Rotated the sphere to hide visible texture imperfection issues on the surface.

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4) // We set default sizes inside the "SphereGeometry" and scale it down here.
bush3.position.set(- 0.8, 0.1, 2.2)
bush3.rotation.x = - 0.75 // Rotated the sphere to hide visible texture imperfection issues on the surface.


const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15) // We set default sizes inside the "SphereGeometry" and scale it down here.
bush4.position.set(- 1, 0.05, 2.6)
bush4.rotation.x = - 0.75 // Rotated the sphere to hide visible texture imperfection issues on the surface.

houseGroup.add(bush1, bush2, bush3, bush4)


// Graves:
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveArmTexture,
    roughnessMap: graveArmTexture,
    metalnessMap: graveArmTexture,
    normalMap: graveArmTexture,
})

const gravesGroup = new THREE.Group()
scene.add(gravesGroup)

for (let i = 0; i < 30; i ++){

    // Cordinates:
    const angle = Math.random() * Math.PI * 2 // Placing graves randomly around a full circle. 

    // Math.random() * 4 creates random number between 0 to 4
    // This means each grave is placed anywhere between 0 and 12 units away from the center (not just in a perfect ring, but scattered within a whole circular area).
    const radius = 3 * Math.random() * 4 // <- This multiplys 4 by 3 which gives us 12

    // The two line below together make sure the grave is placed on the edge of a circle around the center.
    const x = Math.sin(angle) * radius // Math.sin(angle) gives the horizontal (x) part.
    const z = Math.cos(angle) * radius // Math.cos(angle) gives the depth (z) part.

    // Mesh:
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    // Math.random gives random heights to each graves, so one short and one tall. Removing it makes all graves to have a same height.
    grave.position.y = Math.random() * 0.8 / 2 // 0.8 is the default height value of the graveGeometry.
    grave.position.z = z

    grave.rotation.x = (Math.random() - 0.5) * 0.4 // means this value can be between -0.5 to 0.5
    grave.rotation.y = (Math.random() - 0.5) * 0.4 // The * 0.4 limits how much the grave can tilt
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    

    // Add to graves Group
    gravesGroup.add(grave)
}


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Lights
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// When working with blocking (the basic shapes or silhouettes of your models) and texturing, it's generally best to use white light to ensure neutral illumination. 
// But for this project we need to change the lights from white.
// Having a dimmed ambientLight allows the user to enjoy surfaces in the shade and mimics the light's bounce of directionalLight.
// If remove the ambientLight our scene becomes too dark. I depend on what we are building. 

// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)


// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)


// Having the directionalLigh behind the house puts the front part (main side of the house) in the shade so we add pointLight.

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 5) // 5 is the intensity.
doorLight.position.set(0, 2.2, 2.5) //  x, y, and z cordinates.
houseGroup.add(doorLight)



// const pointLightHelper = new THREE.PointLightHelper(doorLight, 0.2) 
// scene.add(pointLightHelper)

// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Ghosts
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// The 3 lines below creates the ghosts, and by default they will be all insided the house in the center. 
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)

// To move the ghosts from the center:
// We want the ghost to rotate around the house in a circular pattern, so we must PPLY trigonometry.
// Since we want the ghost position to change on each frame, we’re going to do it in the tick function.
// In trigonometry, when you send the same angle to sine and cosine, you end up with the x and y coordinates of a circle positioning:
// Check the tick function for this. ⬇
scene.add(ghost1, ghost2, ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
// Shadows
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧

// Renderer
renderer.shadowMap.enabled = true // Tell our renderer to handle shadow map.
renderer.shadowMap.type = THREE.PCFSoftShadowMap // This type of shadow map does not support "radius" which is used for bluring.


// Cast and receive shadows
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

for (const grave of gravesGroup.children){
    grave.castShadow = true
    grave.receiveShadow = true
}

// Mapping
directionalLight.shadow.mapSize.width = 256 // make the shadows blured 
directionalLight.shadow.mapSize.height = 256 // make the shadows blured 
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256 // make the shadows blured 
ghost1.shadow.mapSize.height = 256 // make the shadows blured 
ghost1.shadow.camera.far = 20

ghost2.shadow.mapSize.width = 256 // make the shadows blured 
ghost2.shadow.mapSize.height = 256 // make the shadows blured 
ghost2.shadow.camera.far = 20

ghost3.shadow.mapSize.width = 256 // make the shadows blured 
ghost3.shadow.mapSize.height = 256 // make the shadows blured 
ghost3.shadow.camera.far = 20



// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Sky
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
const sky = new Sky()
sky.scale.set(100, 100, 100) // Changes the value of our sky box
scene.add(sky)

// Customize the sky shader (We learn shaders later on in the course)
// The code code below create the sky as a box instead of the shape of the object, so we have to make the box bigger.

sky.material.uniforms['turbidity'].value = 10 
sky.material.uniforms['rayleigh'].value = 3 
sky.material.uniforms['mieCoefficient'].value = 0.1 
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Fog
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Two ways of creating fog
// scene.fog = new THREE.Fog('#ff0000', 1, 13)
scene.fog = new THREE.FogExp2('#0e343f', 0.1)


// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
// Animate
// ▧▧▧▧▧▧▧▧▧▧▧▧▧▧▧
const timer = new Timer() 

const tick = () =>
{
    // Timer
    timer.update()
    // timer is typically a THREE.Clock() instance in Three.js.
    // ElapsedTime increases gradually as your animation runs.
    const elapsedTime = timer.getElapsed() // Gets the total time (in seconds) that has passed since the timer started. 

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5 // Slows down the ghost's movement by half.
    // console.log(ghost1Angle) // Log the current angle to the console — helpful for debugging or observing the rotation values
    ghost1.position.x = Math.cos(ghost1Angle) * 4 // Set the ghost's X position using the cosine of the angle — this moves it left/right in a circular path
    ghost1.position.z = Math.sin(ghost1Angle) * 4 // Set the ghost's Z position using the sine of the angle — this moves it forward/backward in a circular path
    // Math.sin(ghost1Angle) — base wave
    // Math.sin(ghost1Angle * 2.34) — faster wave
    // Math.sin(ghost1Angle * 3.45) — even faster wave
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) *  Math.sin(ghost1Angle * 3.45) // Creates organic, wavy vertical motion to the ghost's Y position (up and down).

    const ghost2Angle = - elapsedTime * 0.38 // - elapsedTime moves ghost2 in the opposite direction to ghost1 at the slower speed.
    ghost2.position.x = Math.sin(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) *  Math.sin(ghost2Angle * 3.45) 


    const ghost3Angle = elapsedTime * 0.25
    ghost3.position.x = Math.cos(ghost3Angle) * 6 
    ghost3.position.z = Math.sin(ghost3Angle) * 6 
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) *  Math.sin(ghost3Angle * 3.45) 
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

