console.log("net.js")
class Net {

    constructor() {
        console.log("konstruktor klasy Net")
        this.bool = false;
    }
    sendData(userName, action) {
        $.ajax({
            url: "",
            data: { nick: userName, action: action },
            type: "POST",
            success: function (data) {

                let obj = JSON.parse(data)
                if (obj.login) {
                    $("#user-interface-block").text(obj.nick)
                    $("#login-center-block").css("display", "none")
                    game.DisplayPlaySite(obj.site);
                }
                else if (obj.nick == "tabisfull") {
                    $("#user-interface-block").text("Wszystkie sloty są zajęte")
                }
                else if (obj.nick == "RESET") {
                    $("#user-interface-block").text("Zresetowano sloty")

                }
                else {
                    $("#user-interface-block").text(obj.nick + " -użytkownik istnieje")
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        })

    }

    checkSecondPlayer() {
        let interval = setInterval(function () {
            $.ajax({
                url: "",
                data: { action: "ISSECONDUSER" },
                type: "POST",
                success: function (data) {
                    let obj = JSON.parse(data)
                    if (obj.players.length == 2) {
                        clearInterval(interval)
                        $("#waitingRoom").css("display", "none")
                        $("#root").css("opacity", 1)
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                },
            })
        }, 1000)
    }
    changePosition(prevPosX, prevPosZ, posX, posZ, player) {
        activeTurn = false;
        checkTime = true;
        $.ajax({
            url: "",
            data: { action: "UPDATE", prevPosX: prevPosX, prevPosZ: prevPosZ, posX: posX, posZ: posZ, player: player },
            type: "POST",
            success: function (data) {
                let obj = JSON.parse(data)


            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        })
        net.checkChange();
    }
    checkChange() {
        let time = 30;
        let interval = setInterval(function () {
            $("#root").css("opacity", 0.1)
            $("#waitingTurn").css("display", "block")
            $("#waitingTurn").text(time)
            time--
            $.ajax({
                url: "",
                data: { action: "CHECK" },
                type: "POST",
                success: function (data) {
                    let obj = JSON.parse(data)
                    console.log(obj)
                    if (obj.bool == true) {
                        clearInterval(interval)
                        $("#root").css("opacity", 1)
                        $("#waitingTurn").css("display", "none")
                        activeTurn = true;
                        game.UpdateGamePoll(obj.players)
                        currentTab = obj.players;
                        console.log(currentTab)
                    }

                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                },
            })
        }, 1000)
    }



    timer() {
        var interval2;

        var time2 = 29;
        interval2 = setInterval(function () {
            time2--;
            if (time2 < 0) {
                clearInterval(interval2)
                net.changePosition("x", "x", "x", "x", "x")
                activeTurn = false;
            }
            else if (checkTime == true) {
                clearInterval(interval2)
                checkTime = false;
            }
        }, 1000)

    }
    checkAfterMove() {
        $.ajax({
            url: "",
            data: { action: "MOVECHECK" },
            type: "POST",
            success: function (data) {
                let obj = JSON.parse(data)
                game.UpdateGamePoll(obj.players)
                currentTab = obj.players;


            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        })

    }
}
