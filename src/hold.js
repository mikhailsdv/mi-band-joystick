const http = require("http")
const express = require( "express")
const robot = require("robotjs")
robot.setKeyboardDelay(1)

const minDelay = 50
const maxDelay = 1500

const squeeze = (value, minV, maxV) => {
    return (Math.min(maxV, Math.max(minV, value)) - minV) / (maxV - minV);
}

const keyHandler = args => {
    const {key, opposite} = args

    if (!args.isHolding) {
        console.log(key)
        robot.keyToggle(key, "down")
        args.isHolding = true
    }

    const oppositeKey = keys.find(item => item.key === opposite)
    robot.keyToggle(opposite, "up")
    oppositeKey.isHolding = false
}

const resetKey = (args) => {
    const {key} = args
    robot.keyToggle(key, "up")
    args.isHolding = false
}

const keys = [
    {
        from: 200,
        to: 4100,
        axis: "y",
        key: "left",
        opposite: "right",
        isHolding: false,
        handler: function() {
            keyHandler(this)
        },
        reset: function() {
            resetKey(this)
        }
    },
    {
        from: -4100,
        to: -200,
        axis: "y",
        key: "right",
        opposite: "left",
        isHolding: false,
        handler: function() {
            keyHandler(this)
        },
        reset: function() {
            resetKey(this)
        }
    },
    {
        from: -4100,
        to: -600,
        axis: "x",
        key: "down",
        opposite: "up",
        isHolding: false,
        handler: function() {
            keyHandler(this)
        },
        reset: function() {
            resetKey(this)
        }
    },
    {
        from: 600,
        to: 4100,
        axis: "x",
        key: "up",
        opposite: "down",
        isHolding: false,
        handler: function(axis) {
            keyHandler(this)
        },
        reset: function() {
            resetKey(this)
        }
    },
]

const app = express()
const server = http.createServer(app)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.post("/", (req, res) => {
    const body = req.body
    
    //const {x, y, z} = body
    //console.log(body)

    keys.forEach(key => {
        const keyAxisValue = body[key.axis]
        if (keyAxisValue >= key.from && keyAxisValue <= key.to) {
            key.handler()
        }
        else {
            key.reset()
        }
    })

    res.send()
})

server.listen(8000, () => console.log("Server started"))
