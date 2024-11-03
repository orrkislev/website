import { useEffect, useRef, useState } from "react"
import { atom, useRecoilState, useRecoilValue } from "recoil"
import tw from "tailwind-styled-components"
import { Avatar, Switch } from "antd";
import { useUser } from "../../utils/useUser";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { LogInBGStyle, UpgradeBGStyle } from "./AdStuff";
import { accessControlAtom } from "../../utils/accessControl";

export const sideBarAtom = atom({
    key: "sideBarState", default: 'DISCOVER'
})

const Container = tw.div`w-24 h-full z-100 p-2 transition-all duration-200 hover:w-48 flex flex-col justify-between items-center ease-in-out px-6 hover:px-2`
const Group = tw.div`flex flex-col gap-2 bg-white rounded-e-3xl rounded-s-3xl align-center p-2`
const Icon = tw.div`text-2xl`

const Element = tw.div`
    rounded-e-3xl rounded-s-3xl flex justify-center items-center cursor-pointer overflow-hidden
    ${(p) => (p.$active ? "bg-gray-500 hover:bg-gray-800" : "hover:bg-gray-200")}
    ${(p) => (p.$flexible ? "" : "h-8")}
    ${(p) => (p.$enabled ? "" : "text-gray-400 bg-gray-200 cursor-default")}
    aspect-square
    `


export default function SideBar() {
    const [isHovered, setIsHovered] = useState(false)
    const accessControl = useRecoilValue(accessControlAtom)

    return (
        <Container onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className='flex-1' />
            <div className="flex-1 flex flex-col justify-center align center w-full">
                <Group>
                    <SideBarButton name="DISCOVER" open={isHovered} enabled={true} />
                    <SideBarButton name="PLAY" open={isHovered} enabled={!accessControl.limitations.includes('play')} />
                    <SideBarButton name="STUDY" open={isHovered} enabled={!accessControl.limitations.includes('study')} />
                    <SideBarButton name="EXPLORE" open={isHovered} enabled={!accessControl.limitations.includes('explore')} />
                    <SideBarButton name="EXPERIMENT" open={isHovered} enabled={!accessControl.limitations.includes('experiment')} />
                </Group>
            </div>
            <div className="flex-1 flex flex-col justify-end align center w-full">
                <BottomGroup open={isHovered} />
            </div>
        </Container>
    )
}

function SideBarButton({ name, open, enabled }) {
    const [sideBarState, setSideBarState] = useRecoilState(sideBarAtom)
    const handleClick = () => {
        if (enabled) setSideBarState(name)
    }
    return (
        <Element onClick={handleClick} $active={sideBarState === name} $small={!open} $enabled={enabled}>
            {open && <p> {name} </p>}
            {!open && <Icon> {name[0]} </Icon>}
        </Element>
    )
}


function BottomGroup({ open }) {
    const user = useUser()

    const handleClick = () => {
        if (user.user) user.logout()
        else user.login()
    }

    return (
        <Group>
            <UIToggle open={open} />
            <BottomAd user={user} open={open} />
            <Element style={{ background: 'none', display: 'flex', gap: '.5em' }}>
                <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} onClick={handleClick}>
                    {user.user ? user.user.name.split(' ').map(w => w[0]).join('').toUpperCase() : '?'}
                </Avatar>
                {open && user && (
                    <button onClick={handleClick}>
                        {user.user ? 'LOG OUT' : 'LOG IN'}
                    </button>
                )}
                {open && !user && (
                    <button onClick={handleClick}>
                        LOG IN
                    </button>
                )}
            </Element>
        </Group>
    )
}

function UIToggle({ open }) {
    const [sideBarState, setSideBarState] = useRecoilState(sideBarAtom)
    const toggle = () => {
        if (sideBarState.includes('_UI')) setSideBarState(prev => prev.replace('_UI', ''))
        else setSideBarState(prev => prev + '_UI')
    }
    const uiEnabled = !sideBarState.includes('_UI')
    return (
        <Element open={open} $enabled={true} onClick={() => { }}>
            {open && <Switch checkedChildren="Hide UI" unCheckedChildren="Show UI" onChange={toggle} checked={uiEnabled} />}
            {!open && <Avatar style={{ backgroundColor: uiEnabled ? 'blue' : 'gray', color: uiEnabled ? 'white' : 'black' }}>UI</Avatar>}
        </Element>
    )
}



const AdSide = tw(motion.div)`absolute bg-red-500 rounded-lg transform -translate-x-1/2 -translate-y-1/2 text-xs p-1 w-full`


function BottomAd({ user, open }) {
    const [isHovered, setIsHovered] = useState(false)

    let txt = 'LOG IN'
    let txts = ['its FREE!', 'its FUN!', 'Gain Access to the FREE features']
    let bgStyle = LogInBGStyle
    let click = user.login

    if (user.user) {
        bgStyle = UpgradeBGStyle
        if (user.user.plan == 'free') {
            txt = 'GAIN FULL ACCESS'
            txts = ['Learn how stuff like this works', 'Access to all projects and features', 'Save your experiments', 'And much more!']
            click = user.upgrade
        }
        if (user.user.plan == 'pro') txt = 'GOOD JOB!'
    }

    const data = [
        { color: 'bg-red-400', top: '50%', left: '90%', rotate: -10, delay: 0.2 },
        { color: 'bg-cyan-400', top: '-20%', left: '110%', rotate: -20, delay: 0.5 },
        { color: 'bg-orange-400', top: '20%', left: '100%', rotate: 0, delay: .8 },
        { color: 'bg-yellow-400', top: '90%', left: '100%', rotate: 10, delay: 1.1 }
    ]

    return (
        <Element $small={!open} $flexible style={bgStyle}
            className="text-white font-bold text-2xl overflow-visible relative cursor-pointer"
            onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
            onClick={click}
        >
            <AnimatePresence>
                {isHovered && txts.map((txt, i) => (
                    <AdSide key={i}
                        initial={{ left: '50%', top: data[i].top, opacity: 0, scale: 0 }}
                        animate={{ left: data[i].left, top: data[i].top, opacity: 1, rotate: data[i].rotate, scale: 1, transition: { delay: data[i].delay } }}
                        exit={{ left: '50%', top: data[i].top, opacity: 0, scale: 0 }}
                        className={`text-white ${data[i].color}`}>
                        {txt}
                    </AdSide>
                ))
                }
            </AnimatePresence>
            <div className='text-center'>{open ? txt : '!'}</div>
        </Element>
    )
}