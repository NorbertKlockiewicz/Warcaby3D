var http = require("http");
var fs = require("fs");
var qs = require("querystring")
let nicktab = [];
let playerstab = [[0, 2, 0, 2, 0, 2, 0, 2],
[2, 0, 2, 0, 2, 0, 2, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 3, 0, 3, 0, 3, 0, 3],
[3, 0, 3, 0, 3, 0, 3, 0]];
var dataReceived = false;
function ShowPage(path, req, res) {
    fs.readFile(decodeURI(path), function (error, data) {
        if (path.includes(".css")) {
            res.writeHead(200, { 'Content-Type': 'text/css' });
        } else if (path.includes(".js")) {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
        } else if (path.includes(".html")) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        } else if (path.includes(".jpg")) {
            res.writeHead(200, { 'Content-Type': 'image/jpeg' })
        } else if (decodeURI(path.includes(".mp3"))) {
            res.writeHead(200, { "Content-type": "audio/mpeg" });
        }
        res.end(data);
    })
}

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            if (req.url === "/") {
                ShowPage("static/index.html", req, res)
            }
            else if (decodeURI(req.url.includes(".css")) || decodeURI(req.url.includes(".js")) || decodeURI(req.url.includes(".jpg") || decodeURI(req.url.includes(".mp3")))) {
                ShowPage("static" + decodeURI(req.url), req, res)
            }
            break;
        case "POST":
            servResponse(req, res)
            break;

    }
})

function servResponse(req, res) {
    var allData = "";
    req.on("data", function (data) {
        allData += data;
    })

    req.on("end", function (data) {
        var finish = qs.parse(allData)
        switch (finish.action) {
            case "ADD_USER":
                if (nicktab.length > 1) {
                    let info = "tabisfull"
                    res.end(JSON.stringify({ nick: info, login: false }))
                }
                else if (nicktab.includes(finish.nick)) {
                    res.end(JSON.stringify({ nick: finish.nick, login: false, }))
                }
                else {
                    nicktab.push(finish.nick)
                    let site;
                    if (nicktab.length == 1) {
                        site = 1
                    }
                    else {
                        site = 2
                    }
                    res.end(JSON.stringify({ nick: finish.nick, login: true, site: site }));
                }
                break;

            case "RESET":
                nicktab = [];
                playerstab = [[0, 2, 0, 2, 0, 2, 0, 2],
                [2, 0, 2, 0, 2, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 3, 0, 3, 0, 3, 0, 3],
                [3, 0, 3, 0, 3, 0, 3, 0]];
                dataReceived = false;
                res.end(JSON.stringify({ nick: "RESET" }));
                break;
            case "ISSECONDUSER":
                res.end(JSON.stringify({ players: nicktab, }))
                break;
            case "UPDATE":
                console.log(finish)
                if (finish.prevPosX != "x" && Math.abs(finish.prevPosX - finish.posX) < 2) {
                    playerstab[finish.prevPosZ][finish.prevPosX] = 0
                    playerstab[finish.posZ][finish.posX] = parseInt(finish.player)
                }
                else if (finish.prevPosX != "x" && Math.abs(finish.prevPosX - finish.posX) > 1) {
                    playerstab[finish.prevPosZ][finish.prevPosX] = 0
                    playerstab[finish.posZ][finish.posX] = parseInt(finish.player)
                    playerstab[(parseInt(finish.posZ) + parseInt(finish.prevPosZ)) / 2][(parseInt(finish.posX) + parseInt(finish.prevPosX)) / 2] = 0
                }
                dataReceived = true
                res.end(JSON.stringify({ test: "GDFGFD" }))
                break;
            case "CHECK":
                res.end(JSON.stringify({ bool: dataReceived, players: playerstab }))
                dataReceived = false;
                break;
            case "MOVECHECK":
                res.end(JSON.stringify({ players: playerstab }))
            default:

        }
    })
}
server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});


