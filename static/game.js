class Game {

    constructor() {
        console.log("konstruktor klasy Ui")
        this.tab = [];
        this.playertab = [];
        this.i = 0;
        this.scene = new THREE.Scene();
    }

    LoginButtonClick() {
        let userName = $("#user-name").val()
        console.log(userName.length)
        if (userName.length > 0) {
            net.sendData(userName, "ADD_USER")
        }
        else {
            $("#user-interface-block").text("Podaj Nick")
        }
        let count = 0
        let playercount = 0;
        for (let i = 0; i < 8; i++) {
            this.tab[i] = []
            this.playertab[i] = []
            for (let j = 0; j < 8; j++) {
                this.tab[i][j] = count;
                this.playertab[i][j] = playercount;
                if (count == 0) {
                    count = 1
                    if (i < 2)
                        playercount = 2;
                    else if (i > 5)
                        playercount = 3;
                }
                else {
                    count = 0
                    if (i < 2 || i > 5)
                        playercount = 0
                }
            }
            if (playercount == 0 && i < 2)
                playercount = 2
            else if (playercount == 0 && i > 5)
                playercount = 3;
            else if (playercount == 2 && i < 2 || i > 5) { playercount = 0 }
            if (count == 0) {
                count = 1
            }
            else {
                count = 0
            }
        }
        console.table(this.tab)
        console.table(this.playertab)
        currentTab = this.playertab;

    }
    UpdateGamePoll(players) {
        this.playertab = players;
        for (let i = 0; i < myPlayers.length; i++) {
            this.scene.remove(myPlayers[i])
        }
        let z = 0;
        for (let i = 0; i < players.length; i++) {
            let x = 0;
            for (let j = 0; j < players.length; j++) {
                var pionek = new Pionek(x, 0, z, players[i][j])
                x += 10
                if (pionek != undefined) {
                    this.scene.add(pionek)

                }
            }
            z += 10
        }
        net.timer();
    }

    ResetButtonClick() {
        net.sendData(1, "RESET")
    }

    DisplayPlaySite(site) {
        var tabPosX;
        var tabPosZ;
        var highlightedPools = [];
        $("#waitingRoom").css("display", "block")
        $("#root").css("opacity", 0.3)
        net.checkSecondPlayer();
        var tabofPlayers = [];
        var camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );
        var raycaster = new THREE.Raycaster();
        var mouseVector = new THREE.Vector2()
        var renderer = new THREE.WebGLRenderer();
        var x = false;
        var clickedobj;
        renderer.setClearColor(0xf708090);
        renderer.setSize(window.innerWidth, window.innerHeight);
        $("#root").append(renderer.domElement);
        let z = 0;
        for (let i = 0; i < this.tab.length; i++) {
            let x = 0;
            for (let j = 0; j < this.tab.length; j++) {
                let cube = pool.CreatePool(x, 0, z, this.tab[i][j])
                var pionek = new Pionek(x, 0, z, this.playertab[i][j])

                x += 10
                this.scene.add(cube)
                if (pionek != undefined) {
                    this.scene.add(pionek)
                }
            }
            z += 10
        }
        if (site == 1) {
            camera.position.set(40, 60, -80)
            activeTurn = true;
            net.timer();
        }
        else {
            camera.position.set(40, 60, 160)
            net.checkChange(this.playertab);

        }
        $(document).mousedown((event) => {
            mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
            mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(mouseVector, camera);
            let intersects = raycaster.intersectObjects(this.scene.children);
            if (intersects.length > 0) {
                if (x == true) {
                    x = false;
                }


                clickedobj = intersects[0].object;
                x = true;
            }
        })

        camera.lookAt(40, 0, 40)
        var render = () => {
            requestAnimationFrame(render);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            if (activeTurn == true) {
                if (site == 1) {
                    if (x == true && clickedobj.geometry.type == "CylinderGeometry" && clickedobj.colorType == "yellow") {
                        clickedobj.material.color.setHex(0xffffff)
                        tabPosX = clickedobj.position.x / 10;
                        tabPosZ = clickedobj.position.z / 10
                        if (highlightedPools.length > 0) {
                            for (i = 0; i < highlightedPools.length; i++) {
                                highlightedPools[i].material = new THREE.MeshBasicMaterial({
                                    side: THREE.DoubleSide,
                                    map: new THREE.TextureLoader().load("/mats/wood.jpg"),
                                    transparent: false,
                                    opacity: 0,

                                })
                            }

                        }
                        highlightedPools = [];


                        if (currentTab[tabPosZ + 1][tabPosX + 1] == 0 && poolTab[tabPosX + 1][tabPosZ + 1] != undefined) {
                            poolTab[tabPosX + 1][tabPosZ + 1].material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                            poolTab[tabPosX + 1][tabPosZ + 1].clicked = true;
                            highlightedPools.push(poolTab[tabPosX + 1][tabPosZ + 1])
                        }

                        if (currentTab[tabPosZ + 1][tabPosX - 1] == 0 && poolTab[tabPosX - 1][tabPosZ + 1] != undefined) {
                            poolTab[tabPosX - 1][tabPosZ + 1].material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                            poolTab[tabPosX - 1][tabPosZ + 1].clicked = true;
                            highlightedPools.push(poolTab[tabPosX - 1][tabPosZ + 1])
                        }
                        if (currentTab[tabPosZ + 1][tabPosX + 1] == 3 && poolTab[tabPosX + 1][tabPosZ + 1] != undefined && currentTab[tabPosZ + 1][tabPosX + 1] != 2 && currentTab[tabPosZ + 2][tabPosX + 2] != 3) {
                            poolTab[tabPosX + 2][tabPosZ + 2].material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                            poolTab[tabPosX + 2][tabPosZ + 2].clicked = true;
                            highlightedPools.push(poolTab[tabPosX + 2][tabPosZ + 2])
                        }

                        if (currentTab[tabPosZ + 1][tabPosX - 1] == 3 && poolTab[tabPosX - 1][tabPosZ + 1] != undefined && currentTab[tabPosZ + 1][tabPosX - 1] != 2 && currentTab[tabPosZ - 2][tabPosX + 2] != 3) {
                            poolTab[tabPosX - 2][tabPosZ + 2].material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                            poolTab[tabPosX - 2][tabPosZ + 2].clicked = true;
                            highlightedPools.push(poolTab[tabPosX - 2][tabPosZ + 2])
                        }


                        if (tabofPlayers[0] != undefined) {
                            tabofPlayers[0].material.color.setHex(0xffff00)
                        }
                        tabofPlayers[0] = clickedobj;

                        x = false;

                    }
                    else if (x == true && clickedobj.geometry.type == "BoxGeometry" && clickedobj.colorType == "dark" && clickedobj.clicked == true) {

                        let posX = clickedobj.position.x
                        let posZ = clickedobj.position.z


                        if (highlightedPools.length > 0) {
                            for (i = 0; i < highlightedPools.length; i++) {

                                highlightedPools[i].material = new THREE.MeshBasicMaterial({
                                    side: THREE.DoubleSide,
                                    map: new THREE.TextureLoader().load("/mats/wood.jpg"),
                                    transparent: false,
                                    opacity: 0,

                                })
                                highlightedPools[i].clicked = false;

                            }
                        }
                        highlightedPools = [];




                        if (tabofPlayers[0] != undefined) {
                            let prevPosX = tabofPlayers[0].position.x / 10
                            let prevPosZ = tabofPlayers[0].position.z / 10
                            tabofPlayers[0].position.x = posX
                            tabofPlayers[0].position.z = posZ
                            tabofPlayers[0].material.color.setHex(0xffff00)
                            tabofPlayers = []
                            net.changePosition(prevPosX, prevPosZ, posX / 10, posZ / 10, 2)
                            net.checkAfterMove();
                        }
                        x = false;
                    }

                }
                if (site == 2) {
                    if (x == true && clickedobj.geometry.type == "CylinderGeometry" && clickedobj.colorType == "red") {

                        clickedobj.material.color.setHex(0xffffff)
                        tabPosX = clickedobj.position.x / 10;
                        tabPosZ = clickedobj.position.z / 10
                        if (highlightedPools.length > 0) {
                            for (i = 0; i < highlightedPools.length; i++) {

                                highlightedPools[i].material = new THREE.MeshBasicMaterial({
                                    side: THREE.DoubleSide,
                                    map: new THREE.TextureLoader().load("/mats/wood.jpg"),
                                    transparent: false,
                                    opacity: 0,

                                })

                            }
                        }
                        highlightedPools = [];

                        if (currentTab[tabPosZ - 1][tabPosX + 1] == 0 && poolTab[tabPosX + 1][tabPosZ - 1] != undefined) {
                            poolTab[tabPosX + 1][tabPosZ - 1].material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                            poolTab[tabPosX + 1][tabPosZ - 1].clicked = true;
                            highlightedPools.push(poolTab[tabPosX + 1][tabPosZ - 1])
                        }

                        if (currentTab[tabPosZ - 1][tabPosX - 1] == 0 && poolTab[tabPosX - 1][tabPosZ - 1] != undefined) {
                            poolTab[tabPosX - 1][tabPosZ - 1].material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                            poolTab[tabPosX - 1][tabPosZ - 1].clicked = true;
                            highlightedPools.push(poolTab[tabPosX - 1][tabPosZ - 1])
                        }
                        if (currentTab[tabPosZ - 1][tabPosX + 1] == 2 && poolTab[tabPosX + 1][tabPosZ - 1] != undefined && currentTab[tabPosZ - 1][tabPosX + 1] != 3 && currentTab[tabPosX + 2][tabPosZ - 2] != 2) {
                            poolTab[tabPosX + 2][tabPosZ - 2].material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                            poolTab[tabPosX + 2][tabPosZ - 2].clicked = true;
                            highlightedPools.push(poolTab[tabPosX + 2][tabPosZ - 2])
                        }

                        if (currentTab[tabPosZ - 1][tabPosX - 1] == 2 && poolTab[tabPosX - 1][tabPosZ - 1] != undefined && currentTab[tabPosZ - 1][tabPosX - 1] != 3 && currentTab[tabPosX - 2][tabPosZ - 2] != 2) {
                            poolTab[tabPosX - 2][tabPosZ - 2].material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                            poolTab[tabPosX - 2][tabPosZ - 2].clicked = true;
                            highlightedPools.push(poolTab[tabPosX - 2][tabPosZ - 2])
                        }


                        if (tabofPlayers[0] != undefined) {
                            tabofPlayers[0].material.color.setHex(0xff0000)
                        }
                        tabofPlayers[0] = clickedobj;

                        x = false;

                    }
                    else if (x == true && clickedobj.geometry.type == "BoxGeometry" && clickedobj.colorType == "dark" && clickedobj.clicked == true) {
                        let posX = clickedobj.position.x
                        let posZ = clickedobj.position.z

                        if (highlightedPools.length > 0) {
                            for (i = 0; i < highlightedPools.length; i++) {

                                highlightedPools[i].material = new THREE.MeshBasicMaterial({
                                    side: THREE.DoubleSide,
                                    map: new THREE.TextureLoader().load("/mats/wood.jpg"),
                                    transparent: false,
                                    opacity: 0,

                                })
                                highlightedPools[i].clicked = false;

                            }
                        }
                        highlightedPools = [];

                        if (tabofPlayers[0] != undefined) {
                            let prevPosX = tabofPlayers[0].position.x / 10
                            let prevPosZ = tabofPlayers[0].position.z / 10
                            tabofPlayers[0].position.x = posX
                            tabofPlayers[0].position.z = posZ
                            tabofPlayers[0].material.color.setHex(0xff0000)
                            tabofPlayers = [];
                            net.changePosition(prevPosX, prevPosZ, posX / 10, posZ / 10, 3)
                            net.checkAfterMove();
                        }
                        x = false;
                    }

                }
            }
            renderer.render(this.scene, camera);
        }
        render();

    }

}
