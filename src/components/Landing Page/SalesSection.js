import { useState } from "react"
import usePatreon from "../../utils/usePatreon"

export default function SalesSection() {
    const patreon  = usePatreon()
    const [hover, setHover] = useState(false)

    if (patreon.gotAccess) return null

    const click = () => {
        window.open('https://www.patreon.com/orrkislev', '_blank')
    }

    return (
        <section className="flex items-center p-8 bg-amber-500 justify-between px-32">
            <div className="flex justify-between w-full">
                <div>
                    <h2 className="text-3xl font-bold text-white">GET FULL ACCESS</h2>
                    <p className="">Head on to my patreon page and get full access to all my projects</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="bg-white text-black px-12 py-1 rounded h-full rounded-full hover:bg-amber-200 transform duration-200 hover:px-32"
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        onClick={click}>{hover ? 'Take me to Patreon' : 'Learn More'}</button>
                </div>
            </div>
        </section>
    )
}

