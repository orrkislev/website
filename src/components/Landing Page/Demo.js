import React, { useEffect, useRef, useState } from 'react';
import { ReactP5Wrapper } from "@p5-wrapper/react";

export function HeroBackground() {
    const ref = useRef()
    const [rerender, setRerender] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setRerender(true)
        }, 100)
    }, [])
    if (!ref.current) return <div ref={ref} className="w-full h-32" />

    const { width, height } = ref.current.parentElement.getBoundingClientRect()
    const sketch = p5 => {
        let data
        p5.setup = () => {
            p5.createCanvas(width, height);
            p5.angleMode(p5.DEGREES)
            makeGrid()
            p5.stroke(0, 50)
        }
        let lastChange = ''
        p5.draw = () => {
            p5.clear()
            const x = p5.floor(p5.mouseX / 20)
            const y = p5.floor(p5.mouseY / 20)
            if (lastChange !== `${x},${y}` && x >= 0 && x < cols && y >= 0 && y < rows) {
                data[x][y] = (data[x][y] + 1) % 3
                lastChange = `${x},${y}`
            }

            drawGrid()

        }
        let gridGraphics, cols, rows
        const makeGrid = () => {
            p5.background(215, 225, 230)
            p5.blendMode(p5.OVERLAY)
            p5.stroke(0, 0, 255, 100)
            for (let x = 0; x < width; x += 20) p5.line(x, 0, x, height)
            for (let y = 0; y < height; y += 20) p5.line(0, y, width, y)
            p5.blendMode(p5.BLEND)
            gridGraphics = p5.get()
            p5.clear()

            cols = p5.ceil(width / 20)
            rows = p5.ceil(height / 20)
            data = Array(cols).fill().map(() => Array(rows).fill(0))
        }
        const drawGrid = () => {
            p5.clear()
            for (let x = 0; x < cols; x++) {
                const n = (1 - p5.noise(x / 15, p5.frameCount / 100) ** 2) * 0.9
                for (let y = 0; y < rows; y++) {
                    const yPerc = y / rows
                    if (yPerc < n) {
                        p5.copy(gridGraphics, x * 20, y * 20, 20, 20, x * 20, y * 20, 20, 20)
                        if (data[x][y] == 1){
                            for (let i=4;i<20;i+=4){
                                p5.line(x * 20 + i, y * 20, x * 20 + i, y * 20 + 20)
                            }
                        } else if (data[x][y] == 2){
                            for (let i=4;i<20;i+=4){
                                p5.line(x * 20, y * 20 + i, x * 20 + 20, y * 20 + i)
                            }
                        }
                    }
                }
            }
        }
    }
    return <ReactP5Wrapper ref={ref} sketch={sketch} />;
}