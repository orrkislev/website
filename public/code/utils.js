//SNIPPET random
const random = (a = 1, b = 0) => Math.random() * (b - a) + a
//SNIPPET randomRange
const randomRange = (range) => random(range[0], range[1])
//SNIPPET round_random
const round_random = (a = 1, b = 0) => Math.floor(random(a, b + 1))
//SNIPPET choose
const choose = (arr) => arr[Math.floor(random(arr.length))]
//SNIPPET repeat
const repeat = (n, func) => { for(let i = 0; i < n; i++) func(i) }
//SNIPPET Array.get
Array.prototype.get = function get(i) {
    return this[i % this.length]
}
//SNIPPET Array.last
Array.prototype.last = function last() {
    return this[this.length - 1]
}
//SNIPPET lerp
const lerp = (a, b, t) => a + (b - a) * t
//SNIPPET timeout
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//SNIPPET easeInQuad
const easeInQuad = t => t * t
//SNIPPET easeOutQuad
const easeOutQuad = t => t * (2 - t)
//SNIPPET easeInOutQuad
const easeInOutQuad = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
//SNIPPET easeInCubic
const easeInCubic = t => t * t * t
//SNIPPET easeOutCubic
const easeOutCubic = t => (--t) * t * t + 1
//SNIPPET easeInOutCubic
const easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
//SNIPPET easeInQuart
const easeInQuart = t => t * t * t * t
//SNIPPET easeOutQuart
const easeOutQuart = t => 1 - (--t) * t * t * t
//SNIPPET easeInOutQuart
const easeInOutQuart = t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
//SNIPPET easeMap
const easeMap = (ease,t,a,b,c,d) => ease((t - a) / (b - a)) * (d - c) + c


//SNIPPET ApplyShader
const sketch_shaders = {}
let sketch_shader_graphics
function ApplyShader(shaderName, shaderCode, uniforms = {}, graphics) {
    if (!sketch_shader_graphics) sketch_shader_graphics = createGraphics(width, height, WEBGL);
    if (!sketch_shaders[shaderName]) {
        const fragSrc = 'precision highp float; \n' + shaderCode;
        const newShader = sketch_shader_graphics.createFilterShader(fragSrc);
        sketch_shaders[shaderName] = newShader;
    }
    const theShader = sketch_shaders[shaderName];
    sketch_shader_graphics.shader(theShader);
    for (let uniform in uniforms) theShader.setUniform(uniform, uniforms[uniform])
    sketch_shader_graphics.clear()
    sketch_shader_graphics.rect(-width / 2, -height / 2, width, height)
    if (graphics) graphics.image(sketch_shader_graphics, 0, 0)
    else image(sketch_shader_graphics, 0, 0);
}
//SNIPPET GenericParticleClass
class GenericParticleClass{
    constructor(x, y) {
        this.pos = V(x, y)
        this.vel = V(0,0)
        this.acc = V(0,0)
        this.dampening = 0.8
    }
    update() {
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        this.acc.mult(0)
        this.vel.mult(this.dampening)
    }
    applyForce(force) {
        this.acc.add(force)
    }
    relativeForce(target, strength = 1, flip = false) {
        const dir = p5.Vector.sub(target, this.pos)
        let dist = dir.mag()
        if (dist < 1) dist = 1
        const forceMag = strength / dist
        dir.setMag(forceMag)
        if (flip) dir.mult(-1)
        this.applyForce(dir)
    }
    attractTo(target, strength = 1) {
        this.relativeForce(target, strength)
    }
    repelFrom(target, strength = 1) {
        this.relativeForce(target, strength, true)
    }
    bounceOffWalls(border, dampening = 1) {
        if (this.pos.x < border) {
            this.pos.x = border
            this.vel.x *= -dampening
        }
        if (this.pos.x > width - border) {
            this.pos.x = width - border
            this.vel.x *= -dampening
        }
        if (this.pos.y < border) {
            this.pos.y = border
            this.vel.y *= -dampening
        }
        if (this.pos.y > height - border) {
            this.pos.y = height - border
            this.vel.y *= -dampening
        }
    }
}