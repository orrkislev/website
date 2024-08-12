import { useEffect } from "react";
import usePatreon from "../utils/usePatreon";

export default function LoginPage(){
    const patreon = usePatreon()

    useEffect(()=>{
        patreon.logIn()
    },[[patreon]])

    return (
        <div>
            <h1>Logging in...</h1>
        </div>
    )
}