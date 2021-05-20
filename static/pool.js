console.log("pool.js")
class Pool {

    constructor() {
        console.log("konstruktor klasy Pool")
        this.color;
    }
    CreatePool(x, y, z, bool) {
        console.log(x, z)
        if (bool == 1) {
            this.mats = "/mats/wood.jpg"

        }
        else {
            this.mats = "/mats/woodlight.jpg"

        }
        this.geometry = new THREE.BoxGeometry(10, 3, 10);
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load(this.mats),
            transparent: false,
            opacity: 0,

        })
        this.cube = new THREE.Mesh(this.geometry, this.material);
        if (bool == 1) {
            this.cube.colorType = "dark"

        }
        else {
            this.cube.colorType = "light"

        }
        this.cube.position.set(x, y, z)
        this.cube.hfhdffg = x / 10 + "X" + z / 10
        console.log(this.cube)
        console.log(x / 10, z / 10)
        poolTab[x / 10][z / 10] = this.cube;
        return this.cube;
    }

}
