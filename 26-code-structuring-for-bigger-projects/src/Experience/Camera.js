import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from "./Experience.js"

export default class Camera {  
    constructor() {  // Called when creating a new Camera instance
        this.experience = new Experience()  // Get the main Experience instance
        this.sizes = this.experience.sizes  // Reference the viewport sizes (width and height)
        this.scene = this.experience.scene  // Reference the Three.js scene
        this.canvas = this.experience.canvas  // Reference the HTML canvas element where rendering happens

        this.setInstance() // Create and configure the PerspectiveCamera instance
        this.setOrbitControls() // Setup orbit controls for camera interaction
    }

    setInstance() {  // Setup the Three.js PerspectiveCamera
        this.instance = new THREE.PerspectiveCamera(
            35,  // Field of view in degrees
            this.sizes.width / this.sizes.height,  // Aspect ratio based on canvas size
            0.1, // Near clipping plane
            100  // Far clipping plane
        )

        this.instance.position.set(6, 4, 8)  // Position the camera at x=6, y=4, z=8
        this.scene.add(this.instance) // Add the camera to the scene so it can be used in rendering
    }

    setOrbitControls() {  // Setup orbit controls for interactive camera movement
        this.controls = new OrbitControls(this.instance, this.canvas)  // Create orbit controls linked to camera and canvas
        this.controls.enableDamping = true  // Enable smoothing (damping) for camera motion
    }

    resize() {  // Called when the viewport size changes to update camera aspect ratio
        this.instance.aspect = this.sizes.width / this.sizes.height  // Update camera aspect ratio
        this.instance.updateProjectionMatrix()  // Recalculate projection matrix after aspect change
    }

    update() {  // Called every frame to update controls
        this.controls.update()  // Update orbit controls for smooth camera motion
    }
}
