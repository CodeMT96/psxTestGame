import * as THREE from "./node_modules/three";
import { vertexShader, fragmentShader } from "./shaders.js";

class GroundBox {
  constructor(scene, width, height, depth) {
    this.scene = scene;
    this.height = height;
    this.width = width;
    this.depth = depth;
    this.ground = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.ShaderMaterial({
        uniforms: {
          map: { value: null },
          color: { value: new THREE.Color(0x000fff) },
          useTexture: { value: false },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      })
    );

    this.ground.receiveShadow = true;
    this.topFace = this.ground.position.y + this.height / 2;
    this.bottomFace = this.ground.position.y - this.height / 2
    console.log(this.topFace,this.bottomFace);

    this.scene.add(this.ground);
  }
}

export { GroundBox };
