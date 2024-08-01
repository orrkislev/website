//SNIPPET HashGrid
class HashGrid {
    constructor(w, h, cellSize) {
        this.w = w; this.h = h; this.cellSize = cellSize
        this.gridWidth = Math.ceil(w / cellSize)
        this.gridHeight = Math.ceil(h / cellSize)
        this.grid = new Array(this.gridWidth * this.gridHeight).fill().map(() => [])
    }
    clear() {
        this.grid = new Array(this.gridWidth * this.gridHeight).fill().map(() => [])
    }
    clearAndFill(particles) {
        this.clear()
        this.fill(particles)
    }
    fill(particles) {
        particles.forEach(p => this.add(p))
    }
    getCellXY(pos) {
        const x = Math.floor(pos.x / this.cellSize)
        const y = Math.floor(pos.y / this.cellSize)
        return [
            Math.max(Math.min(x, this.gridWidth - 1), 0),
            Math.max(Math.min(y, this.gridHeight - 1), 0)
        ]
    }
    add(particle) {
        const [x, y] = this.getCellXY(particle.pos)
        const i = x + y * this.gridWidth
        this.grid[i].push(particle)
        particle.hashGridClient = new HashGridClient(this, particle, x, y)
        return particle.hashGridClient
    }

    query(particle, radius, log) {
        const [x, y] = this.getCellXY(particle.pos)
        const r = Math.ceil(radius / this.cellSize)
        const x0 = Math.max(x - r, 0)
        const y0 = Math.max(y - r, 0)
        const x1 = Math.min(x + r, this.gridWidth)
        const y1 = Math.min(y + r, this.gridHeight)

        const found = []
        for (let y = y0; y <= y1; y++) {
            for (let x = x0; x <= x1; x++) {
                const i = x + y * this.gridWidth
                found.push(this.grid[i])
            }
        }
        return found.flat()
    }
    knn(particle, k) {
        let neighbors = []
        let r = 10
        while (neighbors.length < k && r < this.w) {
            neighbors = this.query(particle, r)
            r += 10
        }
        neighbors = neighbors.sort((a, b) => a.pos.getDistance(particle.pos) - b.pos.getDistance(particle.pos))
        return neighbors.slice(0, k)
    }
    nearest(particle) {
        return this.knn(particle, 1)[0]
    }
    remove(particle, cellX, cellY) {
        const i = cellX + cellY * this.gridWidth
        const index = this.grid[i].indexOf(particle)
        if (index > -1) this.grid[i].splice(index, 1)
    }
}

class HashGridClient {
    constructor(grid, particle, cellX, cellY) {
        this.grid = grid; this.particle = particle; this.cellX = cellX; this.cellY = cellY
    }
    update() {
        const [newX, newY] = this.grid.getCellXY(this.particle.pos)
        if (newX != this.cellX || newY != this.cellY) {
            this.grid.remove(this.particle, this.cellX, this.cellY)
            this.grid.add(this.particle)
            this.cellX = newX; this.cellY = newY
        }
    }

}