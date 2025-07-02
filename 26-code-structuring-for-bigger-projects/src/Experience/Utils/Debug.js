import GUI from 'lil-gui'

export default class Debug
{
    // Constructor runs when a new instance of Debug is created
    constructor()
    {
        // Activate debug mode only if the URL hash is '#debug'
        // For example, if the URL is 'http://localhost:3000/#debug'
        this.active = window.location.hash === '#debug'

        // Log the result (true or false) to the console for verification
        console.log(this.active)
        // If debug mode is active, create a new GUI instance
        if(this.active)
        {
            this.ui = new GUI()
        }
    }
}