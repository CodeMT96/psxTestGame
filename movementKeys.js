import * as THREE from "./node_modules/three";
//Das ist mit Hilfe von AI entstanden
class KeyEvents {
    constructor() {
        this.keys = {};

        window.addEventListener("keydown", (event) => {
            this.keys[event.code] = true;
        });

        window.addEventListener("keyup", (event) => {
            this.keys[event.code] = false;
        });
    }

    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }
}

export { KeyEvents }