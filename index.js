const express = require("express")
const http = require("http")
const socket = require("socket.io")
const app = express()

app.use(express.static(__dirname + '/src/pages'));


const { block, blockChain } = require("./src/index")

const PORT = 3000

const server = http.createServer(app)

const io = socket.listen(server)

let BLOCKCHAIN = new blockChain()

server.listen(PORT, () => {
    console.log("server listening the port: " + PORT)
})

app.get("/", (req, res) => {
    res.render("index.html")
    //res.sendFile(__dirname + "/src/pages/index.html", {teste: "pao"})
})


app.get("/blockchain", (req, res) => {
    res.send(BLOCKCHAIN.blockchain)
})

app.get("/blockchain/addblock", (req, res) => {

    const blockReceived = BLOCKCHAIN.createBlock("CARAIO") //req.query.block


    if (blockReceived instanceof (block) == false) {
        res.send("block is not valid");
        return;
    }

    BLOCKCHAIN.addBlock(blockReceived)

    io.sockets.emit("newBlock", blockReceived)

    res.send("block added")

})



app.get("/blockchain/findprevioushash", (req, res) => {
    res.send(BLOCKCHAIN.findPreviousHash())
})

app.get("/blockchain/createblock", (req, res) => {
    let data = req.query.data
    if (!data) {
        res.send("data should not be null")
        return;
    }
    res.send(BLOCKCHAIN.createBlock(data))
})


io.on("connection", (socket) => {

    socket.emit("receiveBlockchain", BLOCKCHAIN.blockchain)

})