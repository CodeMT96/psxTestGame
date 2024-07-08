import * as THREE from "./node_modules/three";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { vertexShader, fragmentShader } from "./shaders.js";
// Callback ist von chatGPT Kein plan wie der funktioniert
class Box {
  constructor(
    scene,
    animate,
    width,
    height,
    depth,
    velocity = {
      x: 0,
      y: 0,
      z: 0,
    },
    onLoadCallback
  ) {
    this.scene = scene;
    this.animate = animate;
    this.height = height;
    this.width = width;
    this.depth = depth;
    this.velocity = velocity;

    const loader = new GLTFLoader();
    loader.load("./assets/theSmallBox.glb", (gltf) => {
      this.gltf = gltf.scene;
      this.gltf.scale.set(width, height, depth);
      this.scene.add(this.gltf);

      this.topFace = this.gltf.position.y + this.height / 2;
      this.bottomFace = this.gltf.position.y - this.height / 2;
      this.gltf.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.material = new THREE.ShaderMaterial({
            uniforms: {
              map: { value: obj.material.map },
              useTexture: { value: true },
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
      console.log(this.topFace, this.bottomFace);
      if (onLoadCallback) onLoadCallback(this);
    });
  }
  update() {
    this.topFace = this.gltf.position.y + this.height / 2;
    this.bottomFace = this.gltf.position.y - this.height / 2;

    this.velocity.y += -0.01

    //Cube Falling
    this.gltf.position.y += this.velocity.y;
  }
}
export { Box };
