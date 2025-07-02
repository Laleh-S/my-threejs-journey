import * as THREE from 'three'
import Experience from "./Experience.js"

export default class Rendere {  // Export the Rendere class as default
    constructor() {  // Constructor runs when creating a new instance
        this.experience = new Experience()  // Get the global Experience instance
        this.canvas = this.experience.canvas  // Reference the canvas element from Experience
        this.sizes = this.experience.sizes  // Reference sizes (width, height, pixel ratio)
        this.scene = this.experience.scene  // Reference the Three.js scene to render
        this.camera = this.experience.camera  // Reference the camera for rendering

        this.setInstance()  // Initialize the WebGLRenderer instance with settings
    }

    setInstance() {  // Create and configure the WebGLRenderer
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,  // Render output will go to this canvas element
            antialias: true,      // Enable antialiasing for smoother edges
        })
        this.instance.toneMapping = THREE.CineonToneMapping  // Set tone mapping algorithm
        this.instance.toneMappingExposure = 1.75  // Set exposure level for tone mapping
        this.instance.shadowMap.enabled = true  // Enable shadow mapping for realistic shadows
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap  // Use soft shadows with PCF filtering
        this.instance.setClearColor('#211d20')  // Set the background clear color (dark gray)
        this.instance.setSize(this.sizes.width, this.sizes.height)  // Set the renderer size to match viewport
        this.instance.setPixelRatio(this.sizes.pixelRatio)  // Set pixel ratio for high-DPI screens
    }

    resize() {  // Called when the viewport size changes
        this.instance.setSize(this.sizes.width, this.sizes.height)  // Update renderer size
        this.instance.setPixelRatio(this.sizes.pixelRatio)  // Update pixel ratio for crisp rendering
    }

    update() {  // Called each frame to render the scene
        this.instance.render(this.scene, this.camera.instance)  // Render the scene from the camera’s perspective
    }
}


