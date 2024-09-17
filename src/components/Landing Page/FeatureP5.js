import React, { useEffect, useRef, useState } from 'react';
import { ReactP5Wrapper } from "@p5-wrapper/react";

function FeatureP5(featureSketch) {
    const ref = useRef()
    const [rerender, setRerender] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setRerender(true)
        }, 100)
    }, [])
    if (!ref.current) return <div ref={ref} className="w-full h-32 bg-gray-300 rounded-t" />

    const { width, height } = ref.current.getBoundingClientRect();
    const sketch = featureSketch(width, height);
    return <ReactP5Wrapper ref={ref} sketch={sketch} />;
}

export function PlayFeatureP5() {
    const sketch = (width, height) => {
        return p5 => {
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
    }
    return FeatureP5(sketch)
}
export function LearnFeatureP5() {
    const sketch = (width, height) => {
        return p5 => {
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
                p5.circle(p5.mouseX, p5.mouseY, 70);
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
                    if (mouseDistance < 50) {
                        const dir = p5.createVector(p5.mouseX - this.pos.x, p5.mouseY - this.pos.y).normalize().mult(50);
                        this.target.x = p5.mouseX - dir.x;
                        this.target.y = p5.mouseY - dir.y;
                    } else {
                        this.target.x = this.original.x;
                        this.target.y = this.original.y;
                    }

                    this.pos.x = p5.lerp(this.pos.x, this.target.x, 0.1);
                    this.pos.y = p5.lerp(this.pos.y, this.target.y, 0.1);
                }

                display() {
                    p5.text(this.char, this.pos.x, this.pos.y);
                }
            }
        }
    }
    return FeatureP5(sketch)
}

export function StudyFeatureP5() {
    const sketch = (width, height) => {
        return p5 => {
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
    }
    return FeatureP5(sketch)
}

export function ExploreFeatureP5() {
    const sketch = (width, height) => {
        return p5 => {
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
        }
    }
    return FeatureP5(sketch)
}