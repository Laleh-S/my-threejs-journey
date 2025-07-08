// ⚠️ IMPORTANT:
// The Semicolons(;) are required in glsl language.
// I Installed "Syntax highlighter" pluging for visually distinguishing different parts of your code using colors and formatting.


// 📌📌📌 vertex shader primarily deals with geometry math — it processes vertex positions, normals, and other attributes in 3D space.

// 📌📌📌 TThe Role of W in vec4:
// vec4 has four components:
// x — horizontal coordinate (same as in vec3)
// y — vertical coordinate (same as in vec3)
// z — depth coordinate (same as in vec3)
// w — the homogeneous coordinate

// vec4 has vec3(x, y, z) + w components (coordinates).
// - A vec4 is a 4D vector made of four numbers: x, y, z (the 3D position) plus w (an extra value used in 3D math).
// - This 4th component, w, is part of what’s called homogeneous coordinates, which let us represent points in a way that makes 3D transformations and perspective projection easier and more consistent.

// w controls perspective division (how the point is projected onto the screen).
// - After multiplying by matrices, the GPU divides x, y, and z by w to create the final 2D position on the screen. This division makes objects farther away appear smaller (perspective).

// In clip space, z must be between -w (near) and +w (far).
// - Before perspective division, the depth (z) of the vertex must be inside this range to be considered “visible” to the camera.

// Any vertex with z outside that range gets clipped (not shown on screen).
// - Vertices outside that range are removed (clipped) because they are behind the camera or too far away and won’t be drawn.

// Matrices provided by Three.js transform the vertex.


// 📌📌📌 Matrix
// A matrix is just a grid of numbers arranged in rows and columns.
// It’s used to store data or apply transformations like moving, rotating, or scaling things — especially in math and computer graphics.
// [ a  b ]
// [ c  d ]


// 📌📌📌 4×4 matrix (or mat4)
// Is a grid of 16 numbers used in 3D graphics to move, rotate, scale, and project objects. It transforms 3D points smoothly through space and helps turn 3D scenes into what we see on a 2D screen.
// [ 1, 0, 0, -2 ]  ← move left (x - 2)
// [ 0, 1, 0,  0 ]  ← no movement in Y
// [ 0, 0, 1,  0 ]  ← no movement in Z
// [ 0, 0, 0,  1 ]  ← fixed row

// This is the first row of a 4×4 transformation matrix, which affects the X-axis.
// [ 1, 0, 0, -2 ]
//   ↑  ↑  ↑   ↑
//   |  |  |   └── Move left by 2 units (translation in X)
//   |  |  └────── No rotation or skew between X and Z
//   |  └───────── No rotation or skew between X and Y
//   └──────────── Scale X by 1 (keep size the same)



// 📌📌📌 modelMatrix, viewMatrix, and projectionMatrix:
//  - modelMatrix (Model Transformation Matrix) — Positioning an object
// Imagine having a Lego car. By default, it’s sitting at (0, 0, 0). We pick it up, move it to the right side of the table, and turn it a bit.
// That movement and rotation we applied to the car? That’s what modelMatrix does. It tells the computer where the object is and how it’s rotated in the world.

//  - viewMatrix (View Transformation Matrix) — Moving the camera
// Now imagine walking around the table to get a better view of the Lego car. We move to the left side and bend down to look at it from a lower angle.
// That change in where we’re viewing the car from? That’s viewMatrix. It tells the computer where the camera is and what direction it’s looking.

//  - projectionMatrix (Projection Transformation Matrix) — Creating a picture
// You take a photo of the Lego car with your phone. In the photo, parts of the car that are farther away look smaller.
// That effect — turning a 3D scene into a 2D image with depth — is what projectionMatrix does. It tells the computer how to turn the 3D scene into a flat picture with perspective.

// Summary:
// If you’re moving the object itself → modelMatrix.
// If you’re moving the camera → viewMatrix.
// If you’re transforming how the object looks on screen (like how far away or distorted), you’re using the projectionMatrix.


// 📌📌📌 Void function is called autimatically. We dont need to call it.
//  It doesn’t return a value, it controls what happens during rendering by setting special output variables.
// In a vertex shader, main() sets gl_Position, which tells the GPU where to place each vertex on the screen.

// 📌📌📌 Clip space:
// Clip space is a stage in the graphics pipeline where the GPU decides what parts of your 3D scene are visible and what should be cut off (clipped) before showing it on screen.



// ❗️ These line used only when we use RawShaderMaterial
// Uniform variables: values passed from JavaScript, same for all vertices
// uniform mat4 projectionMatrix;  
// uniform mat4 viewMatrix;   
// uniform mat4 modelMatrix;  

// attribute vec3 position;
// attribute vec2 uv; // We send this to fragment file using varying below.
// ❗️

uniform vec2 uFrequency;  // Controls wave frequency on x and y axes
uniform float uTime;  // Keeps track of elapsed time

// Varying variables: used to pass data from vertex shader to fragment shader
varying vec2 vUv; // Texture coordinate passed to fragment shader. Cannot be called uv, we change to vUv for "varying uv"
varying float vElevation;   // Elevation (z displacement) passed to fragment shader

void main() {
    // Convert local position to world position using the model matrix
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Calculate elevation using sine waves on x and y axes, animated with time
    float elevation = sin(modelPosition.x * uFrequency.x - uTime) / 10.0;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) / 10.0;

    // Apply the elevation by modifying the z position of the vertex
    modelPosition.z += elevation;

    // Convert from world space to view space (camera space)
    vec4 viewPosition = viewMatrix * modelPosition;

    // Convert from view space to clip space (screen space)
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // Set the final position of the vertex on screen
    gl_Position = projectedPosition;

    // Pass the UV coordinates to the fragment shader
    vUv = uv;

    // Pass the elevation value to the fragment shader
    vElevation = elevation;
}


