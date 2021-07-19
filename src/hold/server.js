const http = require("http")
const express = require( "express")
const robot = require("robotjs")
const WebSocket = require( "ws")

const clients = []

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on("connection", ws => {
	!clients.includes(ws) && clients.push(ws)
	
	/*ws.on("message", m => {})
	ws.on("error", e => ws.send(e))*/

	ws.send(JSON.stringify({x: 0, y: 0, z: 0}))
})

const holding = {
	right: false,
	left: false,
	up: false,
	down: false,
}

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.post("/", (req, res) => {
	const body = req.body
	const {x, y, z} = body
	console.log(body)
	//clients.forEach(client => client.send(JSON.stringify(body)))
	//robot.keyTap("enter");

    if (y >= 2000 && !holding.right) {
    	holding.right = true
    	holding.left = false
    	console.log("left")
        robot.keyToggle("right", "up")
        robot.keyToggle("left", "down")
    }
    else if (y <= -2000 && !holding.left) {
    	holding.right = false
    	holding.left = true
    	console.log("right")
        robot.keyToggle("right", "down")
        robot.keyToggle("left", "up")
    }
    else if (y < 2000 && y > -2000 && (holding.left || holding.right)) {
    	console.log("none right left")
    	holding.right = false
    	holding.left = false
        robot.keyToggle("right", "up")
        robot.keyToggle("left", "up")
    }

    if (x >= 1500 && !holding.up) {
    	holding.up = true
    	holding.down = false
    	console.log("up")
        robot.keyToggle("down", "up")
        robot.keyToggle("up", "down")
    }
    else if (x <= -2000 && !holding.down) {
    	holding.up = false
    	holding.down = true
    	console.log("down")
        robot.keyToggle("up", "up")
        robot.keyToggle("down", "down")
    }
    else if (x < 1500 && x > -2000 && (holding.up || holding.down)) {
    	holding.up = false
    	holding.down = false
    	console.log("none up down")
        robot.keyToggle("up", "up")
        robot.keyToggle("down", "up")
    }
	res.send()
})

server.listen(8000, () => console.log("Server started"))