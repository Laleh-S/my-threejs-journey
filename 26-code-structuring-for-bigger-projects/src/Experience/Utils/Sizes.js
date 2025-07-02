import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter {
    constructor() {
        super()

        // ====== Setup ======
        // Initialize width, height,  to the current width and height of the browser window
        this.width = window.innerWidth
        this.height = window.innerHeight

        // Initialize pixelRatio to the device's pixel ratio, capped at 2 for performance
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // ====== Resize event ======
        // Listen for the window resize event. When the window size changes, update the width, height, and pixelRatio properties
        window.addEventListener('resize', () => {

            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
        })
    }
}