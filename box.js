import * as THREE from "./node_modules/three";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js"
import { vertexShader,fragmentShader } from "./shaders.js";
// Callback ist von chatGPT Kein plan wie der funktioniert
class Box {
    constructor(scene, animate, width, height, depth, onLoadCallback) {
      this.scene = scene;
      this.animate = animate;
      this.height = height
      this.width = width
      this.depth = depth

      const loader = new GLTFLoader();
      loader.load("./assets/theSmallBox.glb", (gltf) => {
        this.gltf = gltf.scene;
        this.gltf.scale.set(width, height, depth)
        this.scene.add(this.gltf);

        this.gltf.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.material = new THREE.ShaderMaterial({
              uniforms: {
                map: { value: obj.material.map },
                useTexture: {value: true}
              },
              vertexShader: vertexShader,
              fragmentShader: fragmentShader,
            });
            const { map } = obj.material.uniforms;
            if (map && map.value) {
              map.minFilter = THREE.LinearFilter;
              map.magFilter = THREE.NearestFilter;
              map.needsUpdate = true;
            }
          }
        });
        if (onLoadCallback) onLoadCallback(this)
      });
    }
  }
  export {Box}