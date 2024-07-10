//SETTINGS
{
    "title": true,
    "libraries": ["matter", "p5"]
}
//SETTINGSEND

//EXPLANATION
this sketch draws a bunch of friendly friends, they get pushed upward as more and more friends join the party

each friend is a circle with eyes, and they are being pushed around by more circles, calculated by the matter.js physics engine
and drawn using p5js circle() function

as the canvas does not clear itself, the friends leave a trail behind them, making them look snake-like

TRY: try adding a background at the beginning of the draw function to remove the trails of the friends, and see how it looks
TRY: try changing the colors of the friends, or the eyes, or the background
TRY: try changing the physics engine parameters, like gravity or restitution
TRY: try adding more friends, or changing their size or the force applied to them
TRY: try constraining the friends' movement to a certain area, like a box or a circle

?? what would make them form a flower? or a spiral? or a heart? or a tree?
?? what happens if similar colors are attracted to each other, and different colors repel each other?

//EXPLANATIONEND

//FILE main.js

//COMMENTS
this sketch uses matter.js physics engine to handle collision of circles
every 10ms a new 'ball' is added to the simulation
and it is drawn as a circle with eyes

the buildImage function creates walls on the sides of the canvas, so the balls don't fall off the screen
then it creates 100 balls, one by one, with random size at the bottom at the screen

the renderLoop function updates the physics engine every frame and draws the balls

//CODE

ballSizeRange = [10, 60]
totalBalls = 100
colors = ['pink', 'seagreen', 'salmon', 'azure']
eyeSize = 4
eyeColor = 'black'

// setup runs once at the beginning of the sketch
// it creates the canvas, initializes the physics engine
// and calls the buildImage function (down below)
function setup() {
    createCanvas(windowWidth, windowHeight)
    angleMode(DEGREES)
    initMatter()

    noStroke()
    background(30)

    buildImage()
}

// this is an async function, it runs 'in parallel' with the draw function
// it creates a new ball every 10ms, 200 times
async function buildImage() {
    for (let i = 0; i < totalBalls; i++) {
        const ballX = random(width * .45, width * .55)
        const ballY = height/2
        const ballSize = random(...ballSizeRange)
        ball = new Ball(ballX, ballY, ballSize)

        const ballForceX = random(-.01, .01)
        const ballForceY = random(-.1, .1)
        ball.force(ballForceX, ballForceY)
        await timeout(10)
    }
}

// this is the main loop of the sketch, runs every frame
// it updates the physics engine and draws the balls in their new positions

// TODO : try adding a background at the beginning of the draw function
// to remove the trails of the balls, and see how it looks
function draw() {
    Matter.Engine.update(engine, 0.1, .1)
    balls.forEach(ball => ball.show())
}

//FILE ball.js

//COMMENTS


//CODE
// this file contains the Ball class
// each ball has a Matter.js body and is drawn as a circle
// each ball has a color and eyes
// the force function applies a force to the ball
// the show function draws the ball and its eyes

let balls = []
class Ball {
    constructor(x, y, r) {
        this.body = Matter.Bodies.circle(x, y, r)
        Matter.Composite.add(world, [this.body])
        this.body.frictionAir = .1
        this.body.restitution = 1.2
        this.body.mass = 1
        balls.push(this)
        this.clr = color(choose(colors))
        this.eyeOffsets = [random(r * .1, r * .4), random(r * .1, r * .4)]
        this.eyeRot = random(-30, 30)
        this.blinkCounter = round(random(2500))
        this.lastPos = this.body.position
    }
    force(x, y) {
        Matter.Body.applyForce(this.body, this.body.position, { x, y: -y })
    }
    show() {
        let pos = this.body.position
        let angle = this.body.angle * 180 / PI

        strokeWeight(this.body.circleRadius * 2)
        stroke(this.clr)
        line(this.lastPos.x, this.lastPos.y, pos.x, pos.y)

        push()
        translate(pos.x, pos.y)
        rotate(angle)
        rotate(this.eyeRot)
        if (this.blinkCounter-- < 0) {
            if (this.blinkCounter < -5) this.blinkCounter = round(random(250))
        } else {
            strokeWeight(eyeSize)
            stroke(eyeColor)
            point(-this.body.circleRadius / 2 + this.eyeOffsets[0], -this.body.circleRadius / 2)
            point(this.body.circleRadius / 2 - this.eyeOffsets[1], -this.body.circleRadius / 2)
        }
        pop()

        this.lastPos = { x: pos.x, y: pos.y }
    }
}

//FILE utils

//COMMENTS
this file contains utility functions

//CODE
// some utility functions

// choose a random element from an array
const choose = arr => arr[floor(random(arr.length))]

// wait for a number of milliseconds
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

// initialize the physics engine
function initMatter() {
    engine = Matter.Engine.create();
    engine.gravity.y = 0
    world = engine.world
    engineRunner = Matter.Runner.run(engine);
}
