import { ReactP5Wrapper } from "@p5-wrapper/react"
import p5 from "p5"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import tw from "tailwind-styled-components"
import { usePaddle } from "../../utils/usePaddle"

const ButtonTry = tw.button`bg-amber-500 text-black p-2 rounded-lg hover:bg-amber-400 transition-all hover:text-white hover:text-xl`
const ButtonJoin = tw.button`bg-white text-black p-2 rounded-lg hover:bg-gray-200 transition-all hover:text-xl`


export default function SalesSection() {
    const navigate = useNavigate()
    const paddle = usePaddle()

    return (
        <section className="p-8 bg-gradient-to-r from-amber-500 to-amber-300 min-h-[60vh] relative flex justify-center">
            <div className='absolute inset-0'>
                {/* <SalesBackground /> */}
            </div>
            <div className="flex justify-center gap-16 w-3/4 z-10">
                <div className="flex-1 flex justify-center flex-col gap-2">
                    <h1 className="text-5xl font-bold">Curious?</h1>
                    <p>
                        Dive in and experience the magic!
                        Test-drive one project with full features and explore a preview of every other project in the ‘Discover’ mode.
                        Get a feel for the possibilities and start your creative journey here!
                    </p>
                    <ButtonTry onClick={()=>navigate('/thingies')}>Try Now</ButtonTry>
                </div>
                <div className="flex-1 rounded-lg backdrop-blur-lg overflow-hidden">
                    <div className='absolute inset-0 bg-gradient-to-br from-orange-800 to-amber-800 opacity-40' />
                    <div className="text-center flex flex-col gap-4 p-6 text-white relative">
                        <h2 className="text-3xl font-bold">Unlock Full Creative Power!</h2>
                        <p>
                            Become a member to enjoy exclusive benefits, future upgrades, and a whole world of creative potential.
                        </p>
                        <div className="text-left flex flex-col gap-2">
                            <div className="">
                                <strong>Full Access to Every Project:</strong> Go beyond previews with unrestricted access to every creative mode—<strong>Play</strong>, <strong>Study</strong>, and <strong>Explore</strong>.
                            </div>
                            <div className="">
                                <strong>New Features in Development:</strong> Get early access to tools like AI-assisted code editing, shaping the future of creative coding.
                            </div>
                            <div className="">
                                <strong>Continuous Updates:</strong> Enjoy new projects and features added regularly, keeping your membership fresh and inspiring.
                            </div>
                            <div className="">
                                <strong>Community & Collaboration:</strong> Join a community of creative coders, with options to submit your own code variations, share ideas, and discover new perspectives.
                            </div>
                        </div>
                        <ButtonJoin onClick={paddle.pro_monthly}>Join Now</ButtonJoin>
                    </div>
                </div>
            </div>
        </section>
    )
}



export function SalesBackground() {
    const ref = useRef()
    const [rerender, setRerender] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setRerender(true)
        }, 100)
    }, [])
    if (!ref.current) return <div ref={ref} className="w-full h-full" />

    const { width, height } = ref.current.parentElement.getBoundingClientRect()
    const sketch = p5 => {
        let focus = 1
        let rot = 0, elevation = 0
        let w, sw, z1, z2, z3, z4
        const clrs = ['pink', 'cornflowerblue', 'coral', 'lightgreen', 'tomato']
        let hl, hr
        p5.setup = () => {
            p5.createCanvas(width, height);
            p5.noStroke()
            w = p5.width / 2
            sw = 40
            hl = 100
            hr = height * .4
        }
        p5.draw = () => {
            if (p5.mouseX < p5.width / 2) {
                focus = p5.lerp(focus, 0, 0.1)
                const xperc = p5.mouseX / (p5.width / 2)
                rot = p5.lerp(rot, xperc, 0.1)
            } else {
                focus = p5.lerp(focus, 1, 0.1)
                const xperc = (p5.mouseX - p5.width / 2) / (p5.width / 2)
                rot = p5.lerp(rot, xperc, 0.1)
            }
            const yperc = p5.mouseY / p5.height
            elevation = p5.lerp(elevation, -yperc * 40, 0.1)
            z1 = (1 - focus) * hl + hl * .1 + rot * hl * .1
            z2 = (1 - focus) * hl * .8 + hl * .2 + (1 - rot) * hl * .1
            z3 = focus * hr * .8 + hr * .2 + (1 - rot) * hr * .1
            z4 = focus * hr * .8 + hr * .1 + rot * hr * .1

            p5.translate(p5.width / 2, p5.height / 2)
            p5.clear()

            p5.drawingContext.fillStyle = 'white'
            leftPart(0, 1)
            middlePart(0, 1)
            rightPart(0, 1)
            const f = p5.floor(p5.frameCount / 50) * 50 + (easeInOutQuad((p5.frameCount % 50) / 50)) * 50
            let noises = Array(clrs.length).fill().map((_, i) => p5.noise(i, f / 100))
            noises.unshift(0)
            const totalNoise = noises.reduce((a, b) => a + b, 0)
            noises = noises.map(n => n / totalNoise)
            let t = 0
            noises = noises.map((n, i) => {
                n += t
                t = n
                return n
            })
            for (let i = 0; i < clrs.length; i++) {
                const startPerc = noises[i]
                const endPerc = noises[i + 1] || 1
                const clr = clrs[i]
                const c1 = p5.color(clr)
                c1.setAlpha(50)
                {
                    const grad = p5.drawingContext.createLinearGradient(-sw, 0, sw, 0)
                    grad.addColorStop(0, 'rgba(255,255,255,0)')
                    grad.addColorStop(1, c1.toString())
                    p5.drawingContext.fillStyle = grad
                    middlePart(startPerc, endPerc)
                }
                c1.setAlpha(80)
                {
                    const grad = p5.drawingContext.createLinearGradient(sw, 0, w, 0)
                    grad.addColorStop(0, c1.toString())
                    grad.addColorStop(1, clr)
                    p5.drawingContext.fillStyle = grad
                    rightPart(startPerc, endPerc)
                }
            }

        }
        const leftPart = () => {
            p5.beginShape()
            p5.vertex(-w, -z1 - elevation)
            p5.vertex(-sw, -z2 - elevation)
            p5.vertex(-sw, z2 - elevation)
            p5.vertex(-w, z1 - elevation)
            p5.endShape(p5.CLOSE)
        }
        const middlePart = (startPerc, endPerc) => {
            p5.beginShape()
            p5.vertex(-sw, p5.map(startPerc, 0, 1, -z2, z2) - elevation)
            p5.vertex(sw, p5.map(startPerc, 0, 1, -z3, z3) + elevation)
            p5.vertex(sw, p5.map(endPerc, 0, 1, -z3, z3) + elevation)
            p5.vertex(-sw, p5.map(endPerc, 0, 1, -z2, z2) - elevation)
            p5.endShape(p5.CLOSE)
        }
        const rightPart = (startPerc, endPerc) => {
            p5.beginShape()
            p5.vertex(sw, p5.map(startPerc, 0, 1, -z3, z3) + elevation)
            p5.vertex(w, p5.map(startPerc, 0, 1, -z4, z4) + elevation)
            p5.vertex(w, p5.map(endPerc, 0, 1, -z4, z4) + elevation)
            p5.vertex(sw, p5.map(endPerc, 0, 1, -z3, z3) + elevation)
            p5.endShape(p5.CLOSE)
        }
    }
    return <ReactP5Wrapper ref={ref} sketch={sketch} />;
}


const easeInOutQuad = t => {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}