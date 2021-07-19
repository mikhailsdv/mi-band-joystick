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
	const {
		axis,
		timeout,
		key,
		from,
		to,
	} = args
	clearTimeout(timeout)
	//robot.keyToggle(key, "up")
	const freq = from < 0 ? squeeze(-axis, -to, -from) : squeeze(axis, from, to)
	robot.keyToggle(key, "down")
	let delay = minDelay / (1 - freq)
	!isFinite(delay) && (delay = maxDelay)
	args.timeout = setTimeout(() => {
		robot.keyToggle(key, "up")
		console.log(key, delay)
	}, delay)
}

const resetKey = ({
	timeout,
	key,
}) => {
	clearTimeout(timeout)
	robot.keyToggle(key, "up")
}

const keys = [
	{
		from: 70,
		to: 4000,
		range: [70, 4100],
		axis: "y",
		key: "left",
		timeout: null,
		handler: function(axis) {
			keyHandler({
				...this,
				axis,
			})
		},
		reset: function() {
			resetKey(this)
		}
	},
	{
		from: -4000,
		to: -70,
		range: [-4100, -70],
		axis: "y",
		key: "right",
		timeout: null,
		handler: function(axis) {
			keyHandler({
				...this,
				axis,
			})
		},
		reset: function() {
			resetKey(this)
		}
	},
	{
		from: -4000,
		to: -600,
		range: [-4100, -600],
		axis: "x",
		key: "down",
		timeout: null,
		handler: function(axis) {
			keyHandler({
				...this,
				axis,
			})
		},
		reset: function() {
			resetKey(this)
		}
	},
	{
		from: 600,
		to: 3000,
		range: [600, 4100],
		axis: "x",
		key: "up",
		timeout: null,
		handler: function(axis) {
			keyHandler({
				...this,
				axis,
			})
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
    	if (keyAxisValue >= key.range[0] && keyAxisValue <= key.range[1]) {
    		key.handler(keyAxisValue)
    	}
    	else {
    		key.reset()
    	}
    })

	res.send()
})

server.listen(8000, () => console.log("Server started"))
