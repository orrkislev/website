import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function usePatreon() {
    const [username, setUsername] = useState(null)
    const [gotAccess, setGotAccess] = useState(null)
    const [access_token, setAccessToken] = useState(null)

    useEffect(() => {
        const gotAccess = Cookies.get('gotAccess');
        if (gotAccess) setGotAccess(true)

        const username = Cookies.get('username');
        if (username) setUsername(username)

        const access_token = localStorage.getItem('access_token')
        if (access_token) setAccessToken(access_token)

        if (access_token && !gotAccess) {
            getUserInfo(access_token)
            return
        }
    }, [])

    const getUserInfo = async (access_token) => {
        try {
            const url = `https://us-central1-creative-coding-site.cloudfunctions.net/patreonMember`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ access_token })
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch pledge status: ${response.status}`);
            }
            const data = await response.json();
            const username = data.userInfo.full_name;
            Cookies.set('username', username, { expires: 7 });
            setUsername(username);

            if (data.pledgeAmount == 7) {
                Cookies.set('gotAccess', 'true', { expires: 7 });
                setGotAccess(true);
            }
        } catch (err) {
            console.error('Error checking pledge status:', err);
            // clear access token and refresh token
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    };


    const logIn = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const myUrl = window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://www.orrkislev.work'
        if (urlParams.has('code')) {
            const code = urlParams.get('code')
            const url = `https://us-central1-creative-coding-site.cloudfunctions.net/patreonLogIn`
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, redirect: myUrl + '/login' })
            })
            const data = await response.json()
            if (data.error) {
                console.error('Error logging in:', data.error)
                return
            }

            const { access_token, refresh_token } = data
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('refresh_token', refresh_token)
            setAccessToken(access_token)
        }

        setTimeout(() => {
            window.location.href = window.location.origin
        }, 1000)
    }

    const logOut = () => {
        Cookies.remove('gotAccess')
        Cookies.remove('username')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setUsername(null)
        setGotAccess(null)
        setAccessToken(null)
    }

    return { username, gotAccess, logIn, logOut }
}

export function getPatreonLogInUrl() {
    const myUrl = window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://www.orrkislev.work'
    const client_id = 'uMJ3AF3vKVimCZtb4m5PHEMWFEAIZtFoo-JADsokNDajzhujZIHYxWBNjvNv64V4'
    const url = 'https://www.patreon.com/oauth2/authorize' +
        '?response_type=code' +
        '&client_id=' + client_id +
        '&redirect_uri=' + myUrl + '/login'
    return url
}