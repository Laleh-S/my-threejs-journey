import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Floor {
    constructor () {
        // Get the global Experience instance
        this.experience = new Experience()
        this.scene = this.experience.scene  // Reference to the scene
        this.resources = this.experience.resources  // Reference to loaded resources

        this.setGeometry() // Set the floor geometry
        this.setTextures() // Load and configure textures
        this.setMaterial()  // Create the material using textures
        this.setMesh() // Create and add the mesh to the scene
    }
    
    // Create the floor geometry (a circle)
     setGeometry()
    {
        this.geometry = new THREE.CircleGeometry(5, 64) // Radius 5, segments 64 for smoothness
    }

    // Load and configure textures for the floor
    setTextures()
    {
        this.textures = {} // Create a textures container

         // Load the color texture for the grass
        this.textures.color = this.resources.items.grassColorTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.color.repeat.set(1.5, 1.5) // Repeat the texture in both directions
        this.textures.color.wrapS = THREE.RepeatWrapping  // Enable horizontal tiling
        this.textures.color.wrapT = THREE.RepeatWrapping  // Enable vertical tiling

        // Load the normal map for added surface detail
        this.textures.normal = this.resources.items.grassNormalTexture
        this.textures.normal.repeat.set(1.5, 1.5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping
    }

    // Create a standard material using the loaded textures
    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color, // Apply the color texture
            normalMap: this.textures.normal  // Apply the normal map for realism
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)  // Combine geometry and material
        this.mesh.rotation.x = - Math.PI * 0.5  // Rotate the mesh to lie flat (horizontal)
        this.mesh.receiveShadow = true   // Allow this surface to receive shadows
        this.scene.add(this.mesh) // Add the mesh to the scene
    }
}