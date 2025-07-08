
// 📌📌📌
// In the fragment shader, vec4 usually represents an RGBA color, not a position or direction.
// Example: vec4(1.0, 0.0, 0.0, 1.0) means full red, no green, no blue, fully opaque (alpha = 1.0).


// 📌📌📌
// | Shader type     | Main job                 | `vec4` last component meaning |
// | --------------- | ------------------------ | ----------------------------- |
// | Vertex shader   | Geometry math, positions | `w` (homogeneous coordinate)  |
// | Fragment shader | Colors, pixels           | `alpha` (opacity of color)    |




// ❗️ This line used only when we use RawShaderMaterial
// This line sets the precision for float operations in the shader:
// precision mediump float;
// ❗️

// Uniforms: values passed in from JavaScript (same for all fragments)
uniform vec3 uColor;  // A custom color value (not used here in the current code)
uniform sampler2D uTexture;  // The texture image we want to apply

// Varyings: values passed from the vertex shader (change per fragment)
varying vec2 vUv;  // The UV coordinates for this fragment
varying float vElevation;  // The elevation (z-displacement) of this fragment

void main() {
    // Sample (read) the color from the texture using the UV coordinates
    vec4 textureColor = texture2D(uTexture, vUv);

    // Make the texture color brighter based on elevation
    // This adds a "wave lighting" effect — higher areas are brighter
    textureColor.rgb *= vElevation * 2.0 + 0.9;

    // Set the final color of the pixel (fragment)
    gl_FragColor = textureColor;

    // ⚠️ This line overrides the previous gl_FragColor value!
    // It sets the color using UV values (for testing/debugging, usually)
    // vec2 → red & green channels, 2.0 → blue & alpha channels
    // gl_FragColor = vec4(vUv, 2.0, 2.0);
}