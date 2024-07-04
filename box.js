import * as THREE from "./node_modules/three";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js"
import { vertexShader,fragmentShader } from "./shaders.js";

class Box {
    constructor(scene, animate) {
      this.scene = scene;
      this.animate = animate;

      const loader = new GLTFLoader();
      loader.load("./assets/theSmallBox.glb", (gltf) => {
        this.gltf = gltf.scene;
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
      });
    }
  }
  export {Box}