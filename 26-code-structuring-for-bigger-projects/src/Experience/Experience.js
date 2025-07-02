import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Rendere from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import Debug from './Utils/Debug.js'

import sources from './sources.js'


// A variable to hold the single instance of the Experience class
let instance = null 

export default class Experience {
    // The constructor runs when you create an instance of the class
    constructor(canvas) {
        // If an instance already exists, return it instead of creating a new one (Singleton pattern)
        if (instance){
            return instance
        }
        // Otherwise, set this new object as the instance
        instance = this

        // ====== Global access ======
        // Make this instance accessible globally via the browser's window object. Useful for debugging or accessing from anywhere in the app
        window.experience = this
        
        // ====== Options ======
        // Save the HTML canvas element passed into this class, to use with the renderer
        this.canvas = canvas

        // ====== Setup ====== 
        // Create a Debug instance for debugging tools/UI
        this.debug = new Debug()
        // Create a Sizes instance to track the window's width, height, and pixel ratio
        this.sizes = new Sizes()
        // Create a Time instance to track animation frames
        this.time = new Time()
        // Create a new Three.js scene where 3D objects will be added
        this.scene = new THREE.Scene()
        // Create a Camera instance for viewing the 3D scene
        this.resources = new Resources(sources)
        // Create the Camera instance to view the scene
        this.camera = new Camera()
        // Create a Renderer instance for displaying the scene on the canvas
        this.renderer = new Rendere()
        // Create the World instance to contain 3D objects and logic
        this.world = new World()

        // ====== Sizes resize event ======
        // When the window resizes, listen for the 'resize' event on sizes
        // and call this class’s resize method to update camera and renderer
        this.sizes.on('resize', () => {
            this.resize()
        })

        // ====== Time tick event ======
        // Listen for 'tick' events from the time instance (animation frames)
        // and call this class’s update method to update camera, world, and renderer
        this.time.on('tick', () => {
            this.update()
        })
    }
    // This method adjusts the camera and renderer when the window resizes
    resize() {
        this.camera.resize()  // Update camera aspect ratio and projection matrix
        this.renderer.resize() // Update renderer size and pixel ratio
    }

    // This method updates the camera and renderer on each animation frame
    update() {
        this.camera.update()  // Update camera controls or position
        this.world.update() // Update objects and animations in the world
        this.renderer.update() // Render the scene using the renderer
    }

    // Clean up and dispose of all resources and event listeners to avoid memory leaks
    destroy()
    {
        this.sizes.off('resize') // Remove the resize event listener
        this.time.off('tick') // Remove the tick event listener

        // Traverse the whole scene
        // Traverse all objects in the Three.js scene
        this.scene.traverse((child) =>
        {
            // Check if the child is a mesh (a renderable 3D object)
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()  // Dispose geometry resources

                // Dispose all material properties that have a dispose method
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()  // Dispose textures, maps, or other material resources
                    }
                }
            }
        })

        this.camera.controls.dispose()  // Dispose camera controls (like OrbitControls)
        this.renderer.instance.dispose()  // Dispose the Three.js WebGL renderer instance

        // If debug mode is active, destroy the debug UI to clean up
        if(this.debug.active)
            this.debug.ui.destroy()
    }
}
