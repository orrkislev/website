import { ReactP5Wrapper } from "@p5-wrapper/react"
import p5 from "p5"
import { useEffect, useRef, useState } from "react"

export default function AudienceSection() {
    return (
        <section className="bg-gray-100 py-12 relative">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl text-center mb-8">Who is this for?</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-blue-600 mb-3">Students</h3>
                        <p className="text-gray-700 mb-4">Learn by doing! Dive into hands-on coding projects that make creative coding approachable. Perfect for students looking to apply theoretical knowledge in real-world projects.</p>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-green-600 mb-3">Enthusiasts</h3>
                        <p className="text-gray-700 mb-4">Turn your curiosity into creations. If you’re fascinated by generative art and want to explore how it’s made, this is your playground. No coding experience required—just bring your creativity.</p>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-purple-600 mb-3">Coders</h3>
                        <p className="text-gray-700 mb-4">Challenge your skills. Get access to editable code, experiment with parameters, and discover techniques. Ideal for developers looking to dive into creative coding.</p>
                    </div>

                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-pink-600 mb-3">Designers</h3>
                        <p className="text-gray-700 mb-4">Bring your ideas to life. Discover how code can be a powerful design tool. Perfect for experimenting with color, form, and patterns. Make your concepts tangible with every tweak.</p>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 z-10">
                <AudienceCanvas />
            </div>
        </section>
    )
}


function AudienceCanvas() {
    const ref = useRef()
    const [rerender, setRerender] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setRerender(true)
        }, 100)
    }, [])
    if (!ref.current) return <div ref={ref} className="w-full h-full" />

    const { width, height } = ref.current.parentElement.getBoundingClientRect()
    const sketch = p => {
        p.setup = () => {
            p.createCanvas(width, height);
            p.noStroke()
            for (let i = 0; i < 80; i++) {
                const h = p.random(100, height * .6)
                const w = p.max(20, h * p.random(.3))
                new Friend(p.random(width), w, h)
            }
            friends.sort((a, b) => b.h - a.h + p.random(-100, 100))
        }
        let lastSide = ''
        p.draw = () => {
            if (p.mouseY < 0 || p.mouseY > height) return
            p.clear()
            const horizontal = p.mouseX < width / 2 ? 'left' : 'right'
            if (horizontal !== lastSide) {
                // if (horizontal === 'left') friends.forEach(f => f.targetX = p.random(width / 2 + 50, width))
                if (horizontal === 'left') friends.filter(f=>f.h > 150).forEach(f => f.targetX = p.random(width / 2 + 50, width))
                else if (horizontal === 'right') friends.filter(f=>f.h > 150).forEach(f => f.targetX = p.random(0, width / 2 - 50))
                lastSide = horizontal
            }
            friends.filter(f=>f.h <= 150).forEach(f => {
                if (p.abs(f.x - p.mouseX) < 100 && p.abs(f.targetX - p.mouseX) < 100) f.targetX = p.random(width)
            })
            friends.forEach(f => f.lookAt = p.createVector(p.mouseX, p.mouseY))
            friends.forEach(f => f.draw())
        }

        const friends = []
        class Friend {
            constructor(x, r, h) {
                this.x = x, this.r = r, this.h = h
                this.y = height / 2 - h / 2
                this.hairs = []
                this.vel = 0

                this.stepSpeed = p.random(10, 60)
                this.maxVel = p.random(2, 7)
                this.targetX = x
                this.lookAt = p.createVector(width / 2, height / 2)
                friends.push(this)
                p.colorMode(p.HSB)
                const hue = p.random() ** 5 * 360
                this.clr = p.color(hue, 40, 100)
                this.bodyGrad = p.drawingContext.createLinearGradient(0, height - h, 0, height)
                this.bodyGrad.addColorStop(0, this.clr.toString())
                const clr2 = p.color(hue + 180, 20, 90)
                this.bodyGrad.addColorStop(1, clr2.toString())

                const armLength = h * p.random(.2, .5)
                this.attachHair(-r / 2, 0, armLength)
                this.attachHair(r / 2, 0, armLength)

                this.blinkCounter = p.random(1000)
            }

            attachHair(x, y, length) {
                this.hairs.push({
                    hair: new Hair(this.x + x, this.y + y, length, this.clr),
                    x, y
                })
            }
            updateHairs() {
                this.hairs.forEach(h => h.hair.updatePos(this.x + h.x, this.y + h.y))
            }

            updateMovement() {
                if (p.abs(this.x - this.targetX) < 30) this.vel = 0
                else if (this.targetX > this.x) this.vel = p.lerp(this.vel, this.maxVel, 0.1)
                else this.vel = p.lerp(this.vel, -this.maxVel, 0.1)

                if (this.vel != 0) {
                    const stepHeight = p.abs(this.vel) * 5
                    const step = (p.frameCount % this.stepSpeed) / this.stepSpeed
                    const paStep = parabola(step)
                    this.x += this.vel * paStep
                    this.y = height + 50 - this.h / 2 - stepHeight * paStep
                } else {
                    this.y = height - this.h / 2 + 50
                }
            }

            draw() {
                this.updateMovement()
                this.updateHairs()
                if (this.vel >= 0) this.hairs[1].hair.draw()
                else this.hairs[0].hair.draw()

                p.fill(0)
                p.drawingContext.fillStyle = this.bodyGrad
                p.noStroke()
                p.rect(this.x - this.r / 2, this.y - this.h / 2, this.r, this.h, this.r / 2)

                if (this.blinkCounter-- > 10) {
                    const lookDir = p5.Vector.sub(this.lookAt, p.createVector(this.x, this.y)).normalize()
                    p.push()
                    p.translate(this.x, this.y - this.h * .3)
                    p.drawingContext.fillStyle = 'black'
                    p.circle(-this.r / 4 + lookDir.x * 10, lookDir.y * 20, 4)
                    p.circle(this.r / 4 + lookDir.x * 10, lookDir.y * 20, 4)
                    p.pop()
                } else if (this.blinkCounter < 0) {
                    this.blinkCounter = p.random(1000)
                }

                if (this.vel < 0) this.hairs[1].hair.draw()
                else this.hairs[0].hair.draw()
            }

        }

        class Hair {
            constructor(x, y, length, clr) {
                this.clr = clr
                this.pos = p.createVector(x, y)
                this.nodes = []
                for (let i = 0; i < length; i += 10) {
                    this.nodes.push(new Node(x, y + i))
                }
                this.nodes[0].fixed = true

                this.rods = []
                for (let i = 1; i < this.nodes.length; i++) {
                    this.rods.push(new Rod(this.nodes[i - 1], this.nodes[i]))
                }
            }

            updatePos(x, y) {
                this.pos = p.createVector(x, y)
                this.nodes[0].pos = this.pos
            }

            update() {
                this.nodes.forEach(n => n.update())
                this.rods.forEach(r => r.update())
            }

            draw() {
                p.noFill()
                p.stroke(this.clr)
                p.strokeWeight(5)
                this.update()
                p.beginShape()
                p.curveVertex(this.pos.x, this.pos.y)
                p.curveVertex(this.pos.x, this.pos.y)
                for (let n of this.nodes) {
                    p.curveVertex(n.pos.x, n.pos.y)
                }
                const lastPos = this.nodes[this.nodes.length - 1].pos
                p.curveVertex(lastPos.x, lastPos.y)
                p.endShape()
            }
        }

        class Rod {
            constructor(a, b) {
                this.a = a, this.b = b
                this.length = a.pos.dist(b.pos)
            }
            update() {
                // this.center = this.a.pos.add(this.b.pos).multiply(0.5)
                this.center = p5.Vector.add(this.a.pos, this.b.pos).mult(0.5)
                // const dir = this.a.pos.subtract(this.b.pos).normalize(this.length / 2)
                const dir = p5.Vector.sub(this.a.pos, this.b.pos).normalize().mult(this.length / 2)
                // if (!this.a.fixed) this.a.pos = this.center.add(dir)
                if (!this.a.fixed) this.a.pos = p5.Vector.add(this.center, dir)
                // if (!this.b.fixed) this.b.pos = this.center.subtract(dir)
                if (!this.b.fixed) this.b.pos = p5.Vector.sub(this.center, dir)
            }
        }

        class Node {
            constructor(x, y) {
                this.pos = p.createVector(x, y)
                this.lastPos = this.pos.copy()
            }
            update() {
                if (this.fixed) return
                const currPos = this.pos.copy()
                this.pos.add(p5.Vector.sub(this.pos, this.lastPos))
                this.pos.y += .5
                this.lastPos = currPos
            }
        }
        const parabola = x => 4 * x * (1 - x)
    }
    return <ReactP5Wrapper ref={ref} sketch={sketch} />;
}