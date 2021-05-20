class Pionek extends THREE.Mesh {

    constructor(x, y, z, bool) {
        super() // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        if (bool == 2 || bool == 3) {
            this.geometry = new THREE.CylinderGeometry(3, 3, 3, 32);
            this.material = new THREE.MeshBasicMaterial({
                color: this.color,
                side: THREE.DoubleSide,
                map: new THREE.TextureLoader().load("/mats/pionek.jpg"),
            });
            this.cylinder = new THREE.Mesh(this.geometry, this.material);
            if (bool == 3) {
                this.cylinder.colorType = "red"
                this.cylinder.material.color.setHex(0xff0000)
            }
            else if (bool == 2) {
                this.cylinder.colorType = "yellow"
                this.cylinder.material.color.setHex(0xffff00)
            }

            this.cylinder.position.set(x, y + 2, z)
            poolCounter++
            myPlayers.push(this.cylinder)
            return this.cylinder
        }
    }
}