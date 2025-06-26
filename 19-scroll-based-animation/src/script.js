import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap' // Importing gsap after installing it


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Debug
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => { 
        material.color.set(parameters.materialColor) // The "onChange" tells material to update our color to the new value. Without it our material doesn't know anything changed.
        particlesMaterial.color.set(parameters.materialColor) // The "onChange" tells particlesMaterial to update our color to the new value. 
    })


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Base
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Objects
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤

// Textures:
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
const particleTexture = textureLoader.load('/textures/particles/9.png')
gradientTexture.magFilter = THREE.NearestFilter


// Material: 
// MeshToonMaterial: is a stylized material that gives our 3D objects a cartoon-like (toon-shaded) appearance.
// It is a light based material, meaning it needs lighting to display properly.
const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradientTexture,
    // wireframe: true
 })


// Meshes:
const objectDistance = 4 // This means there are 4 units between each of our objects(mesh1, mesh2, mesh3).

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60), // Params ⮕ radius of torus, radius of tube, radialSegments(segments around the main ring of), tubularSegments(segments around the tube of)
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 10), // Params ⮕ radius, height, radialSegments (Number of segmented faces around the circumference of the cone)
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), // Params ⮕ radius, tube, tubularSegments. radialSegments
    material
)

// In Three.js, the negative Y goes down. Below stacks the 3 meshaes vertically on top of eachother.
mesh1.position.y = - objectDistance * 0
mesh2.position.y = - objectDistance * 1
mesh3.position.y = - objectDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [ mesh1, mesh2, mesh3 ]

// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Particles
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Geometry:
const particleCount = 200
const particlePositions = new Float32Array(particleCount * 3) // particlesCount * 3 ⮕ because we need 3 coordinates (x, y, z) per particle.
for (let i = 0; i < particleCount; i++){

    // We fill the particlePositions array with random values. 
    // Set the x, y, and z position for only one particle (repeated for each particle in the loop).
    particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 10 // Postion x
    particlePositions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length // Position y
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10 // Position z
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3)) // Params ⮕ the name of the attribute("position" is the name used by shadars), bufferAttribute (first param is "particlePositions" our(Float32Array) and second param is 3 because we need x, y , z cooordinates)



// Material:
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true, // when is set to "true", it creates perspective. The farther away the particle is from the camera, the smaller it appears.
    size: 0.4,
    transparent: true,
    alphaMap: particleTexture, 
})



// Points:
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤ 
// Lights
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Sizes
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
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


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Camera
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Group: 
// Create a group that will hold the camera. 
// The group allows you to apply transformations (like position, rotation, etc.) to the entire group of objects inside it.
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
// Create the camera with a perspective view (35 FOV, aspect ratio, near and far clipping planes)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100) // 35 is the cameras fiels of view which is vertical
camera.position.z = 6  // Set the initial camera position
cameraGroup.add(camera) // Add the camera(PerspectiveCamera) to the cameraGroup so that when we move the group, the camera(PerspectiveCamera) moves along with it.

// Controls 
// Why No OrbitControls? becasue we want to have a control over the camera. We do not want the user to move the camera.


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Renderer
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Allows the background of the canvas to be transparent.

})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Scroll
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
let scrollY = window.scrollY // Saving the current scroll value.
let currentSection = 0 // Tracks the section the user is currently in.

window.addEventListener('scroll', () => { 
    scrollY = window.scrollY  // Updating the scrollY variable to the current scroll position when the user scrolls.
    const newSection = Math.round(scrollY / sizes.height) // Dividing the current scroll position by the height of a section to determine the new section. 
    // console.log(newSection) // Logging the new section number to the console for debugging 

     
    if (newSection != currentSection){
        currentSection = newSection 

        gsap.to( // Params ⮕ object to be animated, an object, 
            sectionMeshes[currentSection].rotation, 
            {   
                duration: 1.5, 
                ease: 'power2.inOut', 
                x: '+= 6', // += adds to the current value of the rotation
                y: '+= 3',
                z: '+= 1.5'
            }
        )
    }
})



// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Cursor
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Parallax:  is a visual trick used to create the illusion of depth by making objects move at different speeds depending on how close or far they are from the camera — often based on mouse movement or scrolling.
// We simulate this effect by moving objects at different speeds relative to the camera when:
//  - We scroll the page
//  - We move our mouse

const cursor = {} // The cursor object records the current position of the mouse.
cursor.x = 0
cursor.y = 0

// It listens for any mouse movement across the browser window, and every time the mouse moves, it updates the cursor object with the current mouse position.
window.addEventListener('mousemove', (event) => { 
    // Normalizes the mouse position and centers it.
    // Subtracting 0.5 centers the mouse values, so left movement becomes negative and right stays positive, making it easier to track.
    cursor.x = (event.clientX / sizes.width) - 0.5
    cursor.y = (event.clientY / sizes.width) - 0.5

    // console.log(cursor)
})

// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
// Animate
// ▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤
const clock = new THREE.Clock()
let previousTime = 0 

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime() // Current time

    const deltaTime = elapsedTime - previousTime  // deltaTime is the time between now and the previous frame. 
    previousTime = elapsedTime // We must update the previous time for the next frame.


    // Animate camera:
    camera.position.y = - scrollY / sizes.height * objectDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5 // The negative sign makes objects move opposite to the mouse, creating a parallax effect.

    // Calculate distance needed to move in each direction
    const distanceX = parallaxX - cameraGroup.position.x
    const distanceY = parallaxY - cameraGroup.position.y

    const smoothingSpeed = 5 // Control how quickly we move towards the target

    // Update the cameraGroup's position gradually
    cameraGroup.position.x += distanceX * smoothingSpeed * deltaTime
    cameraGroup.position.y += distanceY * smoothingSpeed * deltaTime


    // Animate meshes:
    for(const mesh of sectionMeshes){ // Loops through each mesh inside "sectionMeshes" and rotates their x and y axis.
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }


    // Render:
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()







