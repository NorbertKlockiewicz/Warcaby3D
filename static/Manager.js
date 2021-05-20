console.log("loaded")
var poolCounter = 0;
var myPlayers = [];
var checkTime = false
var poolTab = [];
var currentTab = [];
for (i = 0; i < 8; i++) {
    poolTab[i] = [];
    currentTab[i] = [];
}
var activeTurn = false;
$(document).ready(function () {
    net = new Net() // utworzenie obiektu klasy Net
    console.log(net)
    game = new Game() // utworzenie obiektu klasy Ui
    console.log(game)
    pool = new Pool()
    pionek = new Pionek()
})