import * as THREE from 'three'
import Experience from '../Experience.js'

// Export the Environment class for managing scene lighting and environment mapping
export default class Environment {
    constructor() {
        // Get access to the global Experience instance
        this.experience = new Experience()
        this.scene = this.experience.scene            // Reference to the scene
        this.resources = this.experience.resources    // Loaded resources (e.g., textures, models)
        this.debug = this.experience.debug            // Debug UI (lil-gui)

        // ====== Debug ======
        // If debug mode is active, create a folder in the UI for the environment settings
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        // Set up lighting and environment map
        this.setSunLight()
        this.setEnvironmentMap()
    }

    // Setup the sun light in the scene
    setSunLight()
    {
        // Create a directional light to simulate sunlight
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true                              // Enable shadows
        this.sunLight.shadow.camera.far = 15                         // Shadow camera range
        this.sunLight.shadow.mapSize.set(1024, 1024)                 // Shadow resolution
        this.sunLight.shadow.normalBias = 0.05                       // Prevent shadow acne
        this.sunLight.position.set(3.5, 2, -1.25)                   
        this.scene.add(this.sunLight)                                

        // ====== Debug controls for light intensity and position ======
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.sunLight, 'intensity')                     // Light intensity slider
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'x')                    // Position X slider
                .name('sunLightX')
                .min(-5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'y')                    // Position Y slider
                .name('sunLightY')
                .min(-5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'z')                    // Position Z slider
                .name('sunLightZ')
                .min(-5)
                .max(5)
                .step(0.001)
        }
    }

    // Setup the environment map for reflections and lighting
    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4                                           // Default intensity
        this.environmentMap.texture = this.resources.items.environmentMapTexture     // Load texture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace                // Set correct color space
        
        this.scene.environment = this.environmentMap.texture                         // Apply to the scene

        // Update materials in the scene to use the environment map
        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                // Only apply to standard materials on meshes
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }

        // Apply the environment map to existing materials
        this.environmentMap.updateMaterials()

        // ====== Debug control for environment map intensity ======
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')                  // Environment map intensity slider
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)         // Update materials when changed
        }
    }
}
