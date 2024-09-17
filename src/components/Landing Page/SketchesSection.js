import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { getGithubUrl, useFileManager } from '../../utils/useFileManager'
import { useLocation, useNavigate } from 'react-router-dom'
import usePatreon from '../../utils/usePatreon'


export default function SketchesSection() {
    const patreon = usePatreon()
    const [sketches, setSketches] = useState([])
    const fileManager = useFileManager()
    const navigate = useNavigate()
    const location = useLocation()
    const thisRef = useRef()

    useEffect(() => {
        fileManager.getFile('', 'sketches.json').then(data => {
            setSketches(data.sketches)
        })
    }, [])

    useEffect(() => {
        if (location && location.hash === '#sketches')
            if (thisRef.current)
                thisRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [location])

    return (
        <section className="p-8 flex flex-col items-center bg-white p-16" ref={thisRef}>
            <h2 className="text-3xl font-bold mb-4 align-center">SKETCHES</h2>
            <div className="grid grid-cols-7 gap-4">
                {sketches.map(sketch => (
                    <SketchLink key={sketch.url} sketch={sketch} />
                ))}
            </div>
        </section>
    )
}

function SketchLink({ sketch }) {
    return (
        <div key={sketch.directory}
            className="bg-gray-200 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 hover:bg-gray-300 transition-colors transition-transform duration-300"
            onClick={() => window.open(sketch.url, '_blank')}>
            <div className="p-4 text-center pb-8">
                <div className="text-xl text-bold">{sketch.name}</div>
                <p>{sketch.description}</p>
            </div>
        </div>
    )
} 