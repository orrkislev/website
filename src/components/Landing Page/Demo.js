import React, { useEffect, useRef, useState } from 'react';
import { ReactP5Wrapper } from "@p5-wrapper/react";

export default function Demo() {
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
        let vals1, vals2, vals3, v = 0, lastPos
        p5.setup = () => {
            p5.createCanvas(width, height);
            p5.fill(255, 255, 200);
            p5.angleMode(p5.DEGREES);
            p5.stroke(255,255,200)
            p5.background(0);

            vals1 = Array(4).fill(0).map((_, i) => p5.random(3));
            vals2 = Array(4).fill(0).map((_, i) => p5.random(3));
            vals3 = Array(4).fill(0).map((_, i) => p5.random(3));
            lastPos = [0,0]
        }
        p5.draw = () => {
            const g = p5.get();
            p5.image(g, -1, 0);

            const t = p5.frameCount * 1;
            const ss1 = vals1.map((s, i) => p5.sin(t * s));
            const ss2 = vals2.map((s, i) => p5.sin(t * s));
            const ss3 = vals3.map((s, i) => p5.sin(t * s));

            const mult1 = ss1.reduce((a, b) => a * b);
            const mult2 = ss2.reduce((a, b) => a * b);
            const mult3 = ss3.reduce((a, b) => a * b);

            const x = mult1 * 200;
            let y = mult2 * 200;
            if (p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height) {
                v = p5.lerp(v, 1, 0.05)
            } else {
                v = p5.lerp(v, 0, 0.05)
            }
            y = p5.lerp(y, p5.mouseY - p5.height / 2, v)
            p5.strokeWeight(mult3 * 12 + 3)
            p5.line(p5.width * 0.8 + lastPos[0], p5.height / 2 + lastPos[1], p5.width * 0.8 + x, p5.height / 2 + y)
            lastPos = [x, y]
            // p5.circle(p5.width * 0.8 + x, p5.height / 2 + y, mult3 * 12 + 3);
        }

    }
    return <ReactP5Wrapper ref={ref} sketch={sketch} />;
}