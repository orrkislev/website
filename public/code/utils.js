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
//SNIPPET sum
const sum = (arr) => arr.reduce((a, b) => a + b, 0)


//SNIPPET Array.get
Array.prototype.get = function get(i) {
    return this[i % this.length]
}
//SNIPPET Array.last
Array.prototype.last = function last() {
    return this[this.length - 1]
}

//SNIPPET object_filter
Object.prototype.filter = function filter(func) {
    const newObj = {}
    for (let key in this) {
        if (func(this[key], key)) newObj[key] = this[key]
    }
    return newObj
}
//SNIPPET object_length
Object.prototype.length = function length() {
    return Object.keys(this).length
}
//SNIPPET object_getKey
Object.prototype.getKey = function getKey(i) {
    return Object.keys(this)[i]
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
        this.pos = VV(x, y)
        this.vel = VV(0,0)
        this.acc = VV(0,0)
        this.dampening = 0.8
    }
    update() {
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        this.acc.multiply(0)
        this.vel.multiply(this.dampening)
    }
    applyForce(force) {
        this.acc.add(force)
    }
    relativeForce(target, strength = 1, flip = false) {
        const forceMag = strength / max(this.pos.distance(target), 1)
        const dir = this.pos.direction(target).normalize(forceMag)
        if (flip) dir.multiply(-1)
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
class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    add(v) {
        this.x += v.x
        this.y += v.y
        return this
    }
    subtract(v) {
        this.x -= v.x
        this.y -= v.y
        return this
    }
    multiply(s) {
        this.x *= s
        this.y *= s
        return this
    }
    divide(s) {
        this.x /= s
        this.y /= s
        return this
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    normalize(l = 1) {
        const len = this.length()
        if (len == 0) return this
        this.x = this.x / len * l
        this.y = this.y / len * l
        return this
    }
    distance(v) {
        const dx = this.x - v.x
        const dy = this.y - v.y
        return Math.sqrt(dx * dx + dy * dy)
    }
    lerpTo(v, t) {
        this.x = lerp(this.x, v.x, t)
        this.y = lerp(this.y, v.y, t)
    }
    direction(v) {
        return new Vector(v.x - this.x, v.y - this.y)
    }
    copy() {
        return new Vector(this.x, this.y)
    }
    rotate(angle) {
        const x = this.x
        const y = this.y
        this.x = x * Math.cos(angle) - y * Math.sin(angle)
        this.y = x * Math.sin(angle) + y * Math.cos(angle)
        return this
    }
    static fromAngle(angle, length = 1) {
        return new Vector(length * Math.cos(angle), length * Math.sin(angle))
    }
}
VV = (x, y) => new Vector(x, y)