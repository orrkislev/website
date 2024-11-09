import { useUser } from "../../utils/useUser";
import { TopBarAnchor, TopBarButtons } from "../__TopBar";
import { FullLogo } from "../HomeLogo";


export default function LandingHeader() {
    const user = useUser()
    return (
        <header className="absolute top-0 w-full flex justify-between items-center p-4 z-[100]">
            <FullLogo width="30px" height="30px" />
            <nav className='flex gap-4'>
                <TopBarButtons>
                    <TopBarAnchor href="#home" className="mx-2">home</TopBarAnchor>
                    <TopBarAnchor href="#projects" className="mx-2">projects</TopBarAnchor>
                    <TopBarAnchor href="#sketches" className="mx-2">sketches</TopBarAnchor>
                    <TopBarAnchor href="#about" className="mx-2">about</TopBarAnchor>
                </TopBarButtons>
                {user.user
                    ? <button className="bg-stone-300 px-3 py-1 rounded" onClick={user.logout}>Log out</button>
                    : <button className="bg-stone-300 px-3 py-1 rounded" onClick={user.login}>Sign In</button>
                }
            </nav>
        </header>
    );
}