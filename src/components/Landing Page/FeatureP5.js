import React, { useEffect, useRef, useState } from 'react';
import { ReactP5Wrapper } from "@p5-wrapper/react";



export default function FeatureBoxes() {
    const [dims, setDims] = useState(null)
    const refs = [useRef(), useRef(), useRef(), useRef()]
    const [rerender, setRerender] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setRerender(true)
        }, 1000)
    }, [])

    if (refs[0].current && !dims) {
        setDims(refs.map(ref => ref.current.getBoundingClientRect()))
    }



    return (
        <section className="flex items-center p-8 justify-between flex-col pt-32 pb-16">
             <h2 className="text-2xl mb-4 font-light text-nowrap text-stone-700">
                Fun coding experiments to play with. Here's what you can do:
             </h2>
            <div className="grid grid-cols-4 gap-4 p-8 w-full">
                {dims ? (
                    <>
                        <PlayFeatureP5 width={dims[0].width} height={dims[0].height} />
                        <LearnFeatureP5 width={dims[1].width} height={dims[1].height} />
                        <StudyFeatureP5 width={dims[2].width} height={dims[2].height} />
                        <ExploreFeatureP5 width={dims[3].width} height={dims[3].height} />
                    </>
                ) : (
                    <>
                        <div ref={refs[0]} className="w-full h-32 bg-stone-300 rounded-t" />
                        <div ref={refs[1]} className="w-full h-32 bg-stone-300 rounded-t" />
                        <div ref={refs[2]} className="w-full h-32 bg-stone-300 rounded-t" />
                        <div ref={refs[3]} className="w-full h-32 bg-stone-300 rounded-t" />
                    </>
                )}
            </div>
        </section >
    )
}









function PlayFeatureP5({ width, height }) {

    const sketch = p5 => {
        let img
        p5.setup = () => {
            p5.createCanvas(width, height)
            p5.noCursor();
            p5.noStroke();
            p5.textSize(40);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.background(250);
            p5.fill(0);
            p5.text("PLAY", p5.width / 2, p5.height / 2);
            img = p5.get()
        }

        p5.draw = () => {
            p5.background(250);
            p5.fill(0);
            p5.text("PLAY", p5.width / 2, p5.height / 2);

            if (p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height) {
                for (let x = 0; x < 15; x++) {
                    p5.copy(img, p5.mouseX, 0, width, height, p5.mouseX + x, 0, width, height)
                    p5.copy(img, p5.mouseX - width, 0, width, height, p5.mouseX - x - width, 0, width, height)
                }
            }

            p5.blendMode(p5.DIFFERENCE);
            p5.fill(0, 255, 255)
            p5.circle(p5.mouseX, p5.mouseY, 70);
            p5.blendMode(p5.BLEND);
        }
    }

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <ReactP5Wrapper sketch={sketch} />
            <div className="p-4 text-center pb-8">
                <h3>PLAY WITH THE ALGORITHM</h3>
                <p>Try out the algorithm yourself. Move things around and see what happens.</p>
            </div>
        </div>
    )
}











function LearnFeatureP5({ width, height }) {
    const [circleSize, setCircleSize] = useState(70)
    const [avoidStrength, setAvoidStrength] = useState(0.1)


    const sketch = p5 => {
        let letters = [];
        const word = "LEARN";
        p5.setup = () => {
            p5.createCanvas(width, height);
            p5.noCursor();
            p5.noStroke();
            p5.textSize(40);
            p5.textAlign(p5.CENTER, p5.CENTER);
            let x = p5.width / 2 - p5.textWidth(word) / 2;
            for (let i = 0; i < word.length; i++) {
                letters.push(new Letter(word[i], x, p5.height / 2));
                x += p5.textWidth(word[i]);
            }
        }

        p5.draw = () => {
            p5.background(250);

            p5.fill(0)
            for (let letter of letters) {
                letter.update();
                letter.display();
            }

            p5.blendMode(p5.DIFFERENCE);
            p5.fill('green');
            p5.circle(p5.mouseX, p5.mouseY, circleSize);
            p5.blendMode(p5.BLEND);
        };

        class Letter {
            constructor(char, x, y) {
                this.char = char;
                this.pos = p5.createVector(x, y);
                this.target = p5.createVector(x, y);
                this.original = p5.createVector(x, y);
            }

            update() {
                const mouseDistance = p5.dist(p5.mouseX, p5.mouseY, this.pos.x, this.pos.y);
                if (mouseDistance < circleSize - 20) {
                    const dir = p5.createVector(p5.mouseX - this.pos.x, p5.mouseY - this.pos.y).normalize().mult(circleSize - 20);
                    this.target.x = p5.mouseX - dir.x;
                    this.target.y = p5.mouseY - dir.y;
                } else {
                    this.target.x = this.original.x;
                    this.target.y = this.original.y;
                }

                this.pos.x = p5.lerp(this.pos.x, this.target.x, avoidStrength);
                this.pos.y = p5.lerp(this.pos.y, this.target.y, avoidStrength);
            }

            display() {
                p5.text(this.char, this.pos.x, this.pos.y);
            }
        }
    }
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <ReactP5Wrapper sketch={sketch} />
            <div className="p-4 text-center pb-8">
                <h3>LEARN HOW IT BEHAVES</h3>
                <p>Change settings to see how it works. There's a short explanation too.</p>
                <br />
                <input
                    class="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer dark:bg-stone-700"
                    type="range" onChange={(e) => setCircleSize(e.target.value)} value={circleSize} min={10} max={100} />
                <br />
                <input
                    class="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer dark:bg-stone-700"
                    type="range" onChange={(e) => setAvoidStrength(e.target.value)} value={avoidStrength} min={0} max={1} step={0.01} />
            </div>
        </div>
    )
}







function StudyFeatureP5({ width, height }) {
    const [hover, setHover] = useState(false)

    const sketch = p5 => {
        p5.setup = () => {
            p5.createCanvas(width, height);
            p5.noCursor();
            p5.noStroke();
            p5.textSize(40);
            p5.textAlign(p5.CENTER, p5.CENTER);
        }

        p5.draw = () => {
            p5.background(250);
            p5.fill(0);
            p5.text("STUDY", p5.width / 2, p5.height / 2);

            p5.push()
            p5.beginClip()
            p5.circle(p5.mouseX, p5.mouseY, 70);
            p5.endClip()
            p5.background('yellow')
            p5.textSize(80);
            p5.textStyle(p5.BOLD);
            p5.fill('orange')
            p5.text("STUDY", p5.width / 2, p5.height / 2);
            p5.pop()
        };
    }

    const code = `function setup(){
    createCanvas(width, height);
    noCursor();
    noStroke();
    textSize(40);
    textAlign(p5.CENTER, p5.CENTER);
}

function draw(){
    background(250);
    fill(0);
    text("STUDY", p5.width / 2, p5.height / 2);

    push()
    beginClip()
    circle(p5.mouseX, p5.mouseY, 70);
    endClip()

    background('yellow')
    textSize(80);
    textStyle(p5.BOLD);
    fill('orange')
    text("STUDY", p5.width / 2, p5.height / 2);
    pop()
}`
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <ReactP5Wrapper sketch={sketch} />
            <div className="p-4 text-center pb-8">
                <h3>STUDY THE CODE, MAKE CHANGES</h3>
                <p>Look at the code and change it. See how your changes affect things.g</p>
                <br />
                <pre className={`p-4 bg-stone-100 rounded-lg text-left ${hover ? 'h-64' : 'h-0'} overflow-auto transition-all duration-300 ease-in-out text-sm`}>
                    {code}
                </pre>
            </div>
        </div>
    )
}








function ExploreFeatureP5({ width, height }) {
    const [currSketch, setCurrSketch] = useState(0)
    const sketches = [
        p5 => {
            let move
            p5.setup = () => {
                p5.createCanvas(width, height);
                p5.noCursor();
                p5.noStroke();
                p5.textSize(40);
                p5.textAlign(p5.CENTER, p5.CENTER);
                move = p5.createVector(0, 0)
            }

            p5.draw = () => {
                p5.background(250);
                p5.fill(0);
                p5.text("EXPLORE", p5.width / 2 + move.x, p5.height / 2 + move.y);

                move.x *= -0.93;
                move.y *= -0.93;

                if (p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height) {
                    move.x += (p5.mouseX - p5.width) / 30
                    move.y += (p5.mouseY - p5.height) / 30
                }

                p5.blendMode(p5.DIFFERENCE);
                p5.fill('red');
                p5.circle(p5.mouseX, p5.mouseY, 70);
                p5.blendMode(p5.BLEND);
            };
        }, p5 => {
            let pos, vel
            p5.setup = () => {
                p5.createCanvas(width, height);
                p5.noCursor();
                p5.noStroke();
                p5.textSize(40);
                p5.textAlign(p5.CENTER, p5.CENTER);
                pos = p5.createVector(0, 0)
                vel = p5.createVector(0, 0)
            }

            p5.draw = () => {
                p5.background(250);
                p5.fill(0);
                p5.text("EXPLORE", p5.width / 2 + pos.x, p5.height / 2 + pos.y);

                if (p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height) {
                    pos.x = p5.lerp(pos.x, p5.mouseX - p5.width / 2, .1)
                    pos.y = p5.lerp(pos.y, p5.mouseY - p5.height / 2, .1)
                } else {
                    vel.add(pos.x / 3, pos.y / 3)
                    vel.mult(0.9)
                    pos.sub(vel)
                }

                p5.blendMode(p5.DIFFERENCE);
                p5.fill('red');
                p5.circle(p5.mouseX, p5.mouseY, 70);
                p5.blendMode(p5.BLEND);
            };
        }, p5 => {
            let letters = []
            p5.setup = () => {
                p5.createCanvas(width, height);
                p5.noCursor();
                p5.noStroke();
                p5.textSize(40);
                p5.textAlign(p5.CENTER, p5.CENTER);
                const word = "EXPLORE";
                let x = p5.width / 2 - p5.textWidth(word) / 2;
                for (let i = 0; i < word.length; i++) {
                    letters.push(new Letter(word[i], x, p5.height / 2));
                    x += p5.textWidth(word[i]);
                }
            }

            p5.draw = () => {
                p5.background(250);
                letters.forEach(letter => letter.update())

                p5.blendMode(p5.DIFFERENCE);
                p5.fill('red');
                p5.circle(p5.mouseX, p5.mouseY, 70);
                p5.blendMode(p5.BLEND);
            };

            class Letter {
                constructor(char, x, y) {
                    this.char = char
                    this.pos = p5.createVector(x, y)
                    this.anger = 0
                }
                update() {
                    const d = p5.dist(p5.mouseX, p5.mouseY, this.pos.x, this.pos.y)
                    if (d < 35) this.anger += .1
                    else this.anger *= .96

                    let x = this.pos.x
                    let y = this.pos.y
                    if (this.anger > 0) {
                        x += p5.random(-this.anger, this.anger)
                        y += p5.random(-this.anger, this.anger)
                    }
                    p5.fill(0)
                    p5.text(this.char, x, y)
                }
            }
        }]
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <ReactP5Wrapper sketch={sketches[currSketch]} />
            <div className="p-4 text-center pb-8">
                <h3>EXPLORE DIFFERENT VARIATIONS</h3>
                <p>Check out different versions made with the same basic idea.</p>
                <br />
                <div className="flex justify-center gap-4">
                    {sketches.map((_, i) => (
                        <button key={i} onClick={() => setCurrSketch(i)} className={`px-4 py-2 rounded ${currSketch === i ? 'bg-stone-400' : 'bg-stone-200'}`} />
                    ))}
                </div>
            </div>
        </div>
    )
}