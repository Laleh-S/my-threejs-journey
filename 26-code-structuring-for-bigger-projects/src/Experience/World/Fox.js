import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Fox {
    constructor () {
        this.experience = new Experience()  // or Experience.getInstance() if using singleton pattern
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time // Time manager for animation updates
        this.debug = this.experience.debug // Debug utilities (like GUI controls)

        // ====== Debug ======
        if(this.debug.active) // If debug mode is active
        {
            // Create a folder in the debug UI to group fox-related controls
            this.debugFolder = this.debug.ui.addFolder('fox') 
        }

        // ====== Setup ======
        // Get the loaded fox model from resources 
        this.resource = this.resources.items.foxModel  
        this.setModel()  // Initialize and add the fox model 
        this.setAnimation()  // Setup fox animations
    }

    // Setup the fox 3D model
    setModel()
    {
        this.model = this.resource.scene  // Extract the 3D scene of the model
        this.model.scale.set(0.02, 0.02, 0.02) // Scale down the model
        this.scene.add(this.model)

        // Enable shadows on all mesh children
        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh) // If the child is a mesh
            {
                child.castShadow = true // Allow it to cast shadows
            }
        })
    }

    // Set up fox animations
    setAnimation()
    {
        this.animation = {}
        // Create an AnimationMixer to control the model's animations
        this.animation.mixer = new THREE.AnimationMixer(this.model) 
        
        // Actions
        this.animation.actions = {}
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]) // Idle animation clip
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])
        
        // Set current action to idle and start playing it by default
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Function to smoothly switch between animations by crossfading
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name] // Get the new action to play
            const oldAction = this.animation.actions.current // Current playing action

            newAction.reset() // Reset new animation to start
            newAction.play()  // Play new animation
            newAction.crossFadeFrom(oldAction, 1) // Smoothly crossfade from old to new animation over 1 second

            this.animation.actions.current = newAction  // Update current action

            // Example debug commands you can run in console:
            // window.experience.world.fox.animation.play('walking')
            // window.experience.world.fox.animation.play('running')
            // window.experience.world.fox.animation.play('idle')
        }
        // Debug
        // Add debug UI buttons to trigger animations manually if debug mode is active
        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }

    // Called every frame to update the animation mixer with the elapsed time
     update()
    {
        this.animation.mixer.update(this.time.delta * 0.001) // Update animations with delta time in seconds
    }
}