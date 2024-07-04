import * as THREE from "./node_modules/three";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js";

//Romans Shaders
const vertexShader = `
varying vec2 vUv;
varying float vAffine;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float dist = length(mvPosition);
  float affine = dist + (mvPosition.w * 8.0) / dist * 0.5;
  vUv = uv * affine;
  vAffine = affine;

  vec2 resolution = vec2(320.0, 240.0);
  vec4 pos = projectionMatrix * mvPosition;
  pos.xyz /= pos.w;
  pos.xy = floor(resolution * pos.xy) / resolution;
  pos.xyz *= pos.w;

  gl_Position = pos;
}
`

const fragmentShader = `
uniform sampler2D map;
varying vec2 vUv;
varying float vAffine;

void main() {
  vec2 uv = vUv / vAffine;
  vec4 color = texture2D(map, uv);
  gl_FragColor = color;
}
`

class Game {
  constructor() {
    const container = document.createElement("div");

    document.body.appendChild(container);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    //Adding a light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Strong white light
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);

    //PSX Render Stuff
    this.renderer.domElement.style.imageRendering = "pixelated";
    //Adding a Cube
    const loader = new GLTFLoader();
    loader.load("./assets/theBox.glb", (gltf) => {
      this.gltf = gltf.scene;
      this.scene.add(this.gltf);

      this.gltf.traverse((obj) => {
        if(obj.isMesh){
          const {map} = obj.material
          if(map){
            map.minFilter = THREE.LinearFilter
            map.magFilter = THREE.NearestFilter
            map.needsUpdate = true
          }
        }
      })
      this.animate();
    });

    window.addEventListener("resize", this.resize.bind(this));
    this.camera.position.z = 5;

    this.animate = this.animate.bind(this);
    this.animate();
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate);
    if (this.gltf !== undefined) {
      this.gltf.rotation.x += 0.001;
      this.gltf.rotation.y += 0.001;
    }

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    this.renderer.render(this.scene, this.scene);
  }
}

export { Game };
