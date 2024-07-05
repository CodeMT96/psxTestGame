import * as THREE from "./node_modules/three";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { Box } from "./box.js";
import { GroundBox } from "./groundBox.js";
import { vertexShader, fragmentShader } from "./shaders.js";

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
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    //Adding a light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);
// Keine ahnung wie der Callback funktioniert
    this.crate = new Box(
      this.scene,
      this.animate.bind(this),
      1,
      1,
      1,
      (box) => {
        console.log(box.gltf.position.y - box.height /2);
      }
    );

    //PSX Render Stuff
    this.renderer.domElement.style.imageRendering = "pixelated";

    // const planeGeo = new THREE.BoxGeometry(5, 0.5, 10);
    // const planeMat = new THREE.ShaderMaterial({
    //   uniforms: {
    //     map: { value: null },
    //     color: { value: new THREE.Color(0x000fff) },
    //     useTexture: { value: false },
    //   },
    //   vertexShader: vertexShader,
    //   fragmentShader: fragmentShader,
    // });
    // const ground = new THREE.Mesh(planeGeo, planeMat);
    // ground.receiveShadow = true;
    this.groundBox = new GroundBox(this.scene ,5, 0.5, 10)
    console.log(this.groundBox);
//     main.js:63 Uncaught 
// TypeError: Cannot set properties of undefined (setting 'y')
//     at new Game (main.js:63:31)
//     at HTMLDocument.<anonymous> (index.html:13:20)

    this.groundBox.position.y = -3;

    

    window.addEventListener("resize", this.resize.bind(this));
    this.camera.position.z = 5;

    const controls = new OrbitControls(this.camera, this.renderer.domElement);

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
    if (this.crate.gltf) {
      this.crate.gltf.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    this.renderer.render(this.scene, this.scene);
  }
}

export { Game };
