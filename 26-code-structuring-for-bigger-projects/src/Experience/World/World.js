// import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'

import Fox from './Fox.js'

export default class World 
{
    constructor()  // The constructor is called when creating a new instance of World
    {
        this.experience = new Experience() // Create a new Experience instance and assign it to this.experience
        this.scene = this.experience.scene  // Reference the Three.js scene from the experience
        this.resources = this.experience.resources  // Reference the loaded resources manager from experience

        // ====== Wait for resources to be fully loaded ======
        this.resources.on('ready', () =>  // Listen for the 'ready' event on resources, triggered when loading finishes
        {
            // ====== Setup scene components once resources are ready ======
            this.floor = new Floor()  // Create a new Floor object and assign it
            this.fox = new Fox() // Create a new Fox object and assign it
            this.environment = new Environment() // Create a new Environment object and assign it
        })
    }

    update() {  // Called on each frame to update the world state
        if(this.fox)  // Check if the fox object exists (to avoid errors before resources load)
            this.fox.update()  // Call the update method on the fox object to update animations or logic
    }
}


