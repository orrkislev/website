//SNIPPET PoissonDiscSampler 
class PoissonDiscSampler {
    constructor(w, h, r, k = 30) {
        this.w = w;
        this.h = h;
        this.k = k;
        this.allPoints = [];
        this.setR(r);

        this.startPoint = {x: w/2, y: h/2};
    }

    setR(r) {
        this.r = r;
        this.r2 = r * r;
        this.cellSize = r / Math.SQRT2;
        this.gridWidth = Math.ceil(this.w / this.cellSize);
        this.gridHeight = Math.ceil(this.h / this.cellSize);
        this.grid = new Array(this.gridWidth * this.gridHeight);
        this.queue = [];

        for (const point of this.allPoints) {
            this.addToGrid(point);
        }
    }

    addToGrid(point) {
        const i = Math.floor(point.x / this.cellSize);
        const j = Math.floor(point.y / this.cellSize);
        this.grid[i + j * this.gridWidth] = point;
    }

    get(sum, startPoint) {
        const points = [];
        
        if (this.allPoints.length == 0 && startPoint) {
            points.push(this.samplePoint(startPoint.x, startPoint.y));
        } else if (this.allPoints.length == 0) {
            points.push(this.samplePoint(this.startPoint.x, this.startPoint.y));
        }

        for (let i = 0; i < sum; i++) {
            const newPoint = this.sample();
            if (newPoint) points.push(newPoint);
            else break;
        }
        return points;
    }

    samplePoint(x, y) {
        const p = {x, y};
        this.addToGrid(p);
        this.allPoints.push(p);
        this.queue.push(p);
        return p;
    }
    getRadius(){
        return this.r2 * random(.6, 1.4)
    }
    sample() {
        if (!this.queue.length) {
            if (this.allPoints.length > 0) {
                this.queue.push(this.allPoints[Math.floor(Math.random() * this.allPoints.length)]);
            } else {
                return this.samplePoint(this.w/2, this.h/2);
            }
        }
        
        while (this.queue.length) {
            const i = Math.floor(Math.random() * this.queue.length);
            const s = this.queue[i];
            for (let j = 0; j < this.k; j++) {
                const a = Math.random() * 2 * Math.PI;
                const r = Math.sqrt(Math.random() * 3 * this.getRadius() + this.getRadius());
                const x = s.x + r * Math.cos(a);
                const y = s.y + r * Math.sin(a);
                if (0 <= x && x < this.w && 0 <= y && y < this.h && !this.isNearby(x, y) && this.isLegal(x,y)) {
                    return this.samplePoint(x, y);
                }
            }
            this.queue[i] = this.queue[this.queue.length - 1];
            this.queue.pop();
        }
        return null;
    }

    isNearby(x, y) {
        const i = Math.floor(x / this.cellSize);
        const j = Math.floor(y / this.cellSize);
        const i0 = Math.max(i - 2, 0);
        const j0 = Math.max(j - 2, 0);
        const i1 = Math.min(i + 3, this.gridWidth);
        const j1 = Math.min(j + 3, this.gridHeight);
        for (let j = j0; j < j1; j++) {
            const o = j * this.gridWidth;
            for (let i = i0; i < i1; i++) {
                const s = this.grid[o + i];
                if (s) {
                    const dx = s.x - x;
                    const dy = s.y - y;
                    if (dx * dx + dy * dy < this.getRadius()) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isLegal(x, y) {
        return true;
    }
}

class PathPoissonSampler extends PoissonDiscSampler {
    constructor(path, w, h, r, k = 30) {
        super(w, h, r, k);
        this.path = path;
        this.startPoint = this.path.randomPointInside();
    }
    
    isLegal(x, y) {
        return this.path.contains(p(x, y));
    }
}