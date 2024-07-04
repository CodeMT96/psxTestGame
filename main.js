import * as THREE from "./node_modules/three";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { Box } from "./box.js";
import { vertexShader,fragmentShader } from "./shaders.js";



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

    

   this.crate = new Box(this.scene, this.animate.bind(this));

    //PSX Render Stuff
    this.renderer.domElement.style.imageRendering = "pixelated";
    //Adding a Cube
    // const loader = new GLTFLoader();
    // loader.load("./assets/theSmallBox.glb", (gltf) => {
    //   this.gltf = gltf.scene;
    //   this.scene.add(this.gltf);

    //   this.gltf.traverse((obj) => {
    //     if (obj.isMesh) {
    //       obj.castShadow = true;
    //       obj.material = new THREE.ShaderMaterial({
    //         uniforms: {
    //           map: { value: obj.material.map },
    //         },
    //         vertexShader: vertexShader,
    //         fragmentShader: fragmentShader,
    //       });
    //       const { map } = obj.material.uniforms;
    //       if (map && map.value) {
    //         map.minFilter = THREE.LinearFilter;
    //         map.magFilter = THREE.NearestFilter;
    //         map.needsUpdate = true;
    //       }
    //       this.gltf.castShadow = true;
    //     }
    //   });
    //   this.animate();
    // });

    // const smallBox = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial(0x00f000))
    // smallBox.castShadow = true
    // this.scene.add(smallBox)

    const planeGeo = new THREE.BoxGeometry(5, 0.5, 10);
    const planeMat = new THREE.ShaderMaterial({uniforms: {
        map: { value: null },
        color: {value: new THREE.Color(0x000fff)},
        useTexture: {value: false}
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,});
    const ground = new THREE.Mesh(planeGeo, planeMat);
    ground.receiveShadow = true;
    ground.position.y = -3;

    this.scene.add(ground);

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
      this.crate.gltf.rotation.y += 0.01
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    this.renderer.render(this.scene, this.scene);
  }
}

export { Game };
