const sha256 = require("crypto-js/sha256")

class block {
    constructor(data, timestamp, previousHash, proofOfWork) {
        this.data = data
        this.timestamp = timestamp
        this.previousHash = previousHash
        this.nonce = 0
        this.proofOfWork = proofOfWork
        this.hash = this.calculateHash()
    }

    calculateHash() {
        while (true) {
            const hash = sha256(this.data + this.timestamp + this.previousHash + this.nonce).toString()

            if (hash.startsWith("0".repeat(this.proofOfWork))) {
                console.log(this.nonce + "  " + hash)
                return hash;
            }

            this.nonce++
        }
    }
}

class blockChain {
    constructor() {
        this.blockchain = [this.createGenesisBlock()]
        this.proofOfWork = 4
    }


    addBlock(blockReceived) {
        this.blockchain.push(blockReceived)
    }


    findPreviousHash() {
        return this.blockchain[this.blockchain.length - 1].hash
    }

    createGenesisBlock() {  
        return new block("genesis block", new Date("01/01/2020"), "impostoéroubo", 4)
    }


    createBlock(data){
        return new block(data, Date.now(), this.findPreviousHash(), this.proofOfWork)
    }

}


module.exports = {
    block,
    blockChain
}