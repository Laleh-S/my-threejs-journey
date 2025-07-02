import EventEmitter from "./EventEmitter"

// Export the Time class so it can be used in other files. It extends EventEmitter to allow event triggering.
export default class Time extends EventEmitter {
    
    constructor () {
        super() // Call the parent class (EventEmitter) constructor

        // ====== Setup initial time values ======
        this.start = Date.now()           // Store the time when the app starts
        this.current = this.start         // Set the current time to the start time initially
        this.elapsed = 0                  // Total time elapsed since the start
        this.delta = 16                   // Time difference between frames (default to ~16ms for 60fps)

        // Start the tick loop using requestAnimationFrame
        window.requestAnimationFrame(() => {
            this.tick()                  // Call the tick method on the next animation frame
        })
    }

    tick() {
        const currentTime = Date.now()           // Get the current time
        this.delta = currentTime - this.current  // Calculate time difference since last frame
        this.current = currentTime               // Update the current time
        this.elapsed = this.current - this.start // Update total elapsed time since start

        // Trigger a 'tick' event so that other parts of the app can update (e.g., animations)
        this.trigger('tick')

        // Call tick again on the next animation frame to keep the loop going
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}
