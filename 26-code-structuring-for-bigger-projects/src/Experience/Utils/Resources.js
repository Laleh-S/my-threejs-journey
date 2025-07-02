import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'

// Define and export a Resources class that extends EventEmitter
export default class Resources extends EventEmitter
{
    // Constructor runs when an instance is created
    constructor(sources)
    {
        super() // Call the parent (EventEmitter) constructor

        this.sources = sources // Store the array of resources to load

        this.items = {} // Will hold loaded items (keyed by their name)
        this.toLoad = this.sources.length // Total number of resources to load
        this.loaded = 0 // Count of resources that have been loaded so far

        this.setLoaders() // Set up the appropriate loaders
        this.startLoading() // Begin loading all resources
    }

    // Initializes the loaders for different types of resources
    setLoaders()
    {
        this.loaders = {} // Create an object to hold loader instances
        this.loaders.gltfLoader = new GLTFLoader() // Loader for .gltf/.glb models
        this.loaders.textureLoader = new THREE.TextureLoader() // Loader for 2D textures
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader() // Loader for cube map textures
    }

    // Starts loading all the resources defined in this.sources
    startLoading()
    {
        // Loop through each source to determine how it should be loaded
        for(const source of this.sources)
        {
            // If the source is a GLTF model
            if(source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path, // Path to the model
                    (file) =>
                    {
                        this.sourceLoaded(source, file) // Call method when loaded
                    }
                )
            }
            // If the source is a 2D texture
            else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path, // Path to the texture
                    (file) =>
                    {
                        this.sourceLoaded(source, file) // Call method when loaded
                    }
                )
            }
            // If the source is a cube texture
            else if(source.type === 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path, // Array of 6 image paths for cube faces
                    (file) =>
                    {
                        this.sourceLoaded(source, file) // Call method when loaded
                    }
                )
            }
        }
    }

    // Called when a resource finishes loading
    sourceLoaded(source, file)
    {
        this.items[source.name] = file // Store the loaded file using its name

        this.loaded++ // Increment the number of loaded resources

        // If all resources are loaded, trigger a 'ready' event
        if(this.loaded === this.toLoad)
        {
            console.log('Finished')
            this.trigger('ready') // Notifies any listener that all resources are ready
        }
    }
}
