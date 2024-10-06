import { useNavigate, useParams } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Project from "./__project";
import usePatreon, { getPatreonLogInUrl } from "../utils/usePatreon";
import { useEffect, useState } from "react";
import { useFileManager } from "../utils/useFileManager";
import ReactGA from 'react-ga4';

export default function ProjectPage() {
    const { name } = useParams();
    document.title = name + ' - Stuff I Made For You, by Orr Kislev'

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: name, title: "Project" + name });
    }, [])

    return (
        <RecoilRoot>
            <PayWall />
            <Project name={name} />
        </RecoilRoot>
    )
}

export function VariationPage() {
    const { name, variation } = useParams();
    document.title = name + ' - Stuff I Made For You, by Orr Kislev'
    return (
        <RecoilRoot>
            <PayWall />
            <Project name={name} variation={variation} />
        </RecoilRoot>
    )
}

function PayWall() {
    const patreon = usePatreon()
    const { name } = useParams()
    const [allow, setAllow] = useState(true)
    const navigate = useNavigate()
    const fileManager = useFileManager()

    useEffect(() => {
        fileManager.getFile('', 'projectIndex.json').then(data => {
            const projectData = data.projects.find(project => project.directory === name)
            if (!projectData) {
                navigate('/')
                return
            }
            if (projectData.locked && !patreon.gotAccess) {
                setAllow(false)
            }
        })
    }, [name, patreon])

    useEffect(() => {
        if (!allow) {
            const timer = setTimeout(() => {
                navigate('/')
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [allow])

    const logIn = () => {
        window.location.href = getPatreonLogInUrl()
    }

    const goToHome = () => {
        navigate('/')
    }

    if (allow) return null
    else return (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-90 flex items-center justify-center" style={{ zIndex: 1000, backdropFilter: 'blur(5px)' }}>
            <div className="bg-white p-8 rounded">
                <h2 className="text-3xl font-bold mb-4">This project is locked</h2>
                <p>I love you, but it seems you don't have access to this project.</p>
                <p>You need to be a patron to view this project.</p>
                <div className="flex justify-between mt-4">
                    <button className="bg-stone-300 px-3 py-1 rounded bg-orange-400" onClick={() => logIn()}>login with Patreon</button>
                    <button className="bg-stone-300 px-3 py-1 rounded ml-2" onClick={() => goToHome()}>home</button>
                </div>
            </div>
        </div>
    )
}