import usePatreon, { getPatreonLogInUrl } from "../utils/usePatreon";
import { styled } from 'styled-components'
import PatreonIcon from '../assets/patreon logo.svg'


const PatreonContainer = styled.div`
    background: #ffffffaa;
    border-radius: 5px;
    padding: 0.5em 1em;
    display: flex;
    align-items: center;
    gap: 10em;
    justify-content: space-between;
`

const LeftSide = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5em;
`
const Texts = styled.div`
    font-size: 0.8em;
    display: flex;
    flex-direction: column;
    gap: 0.1em;

    > div:nth-child(2) {
        font-size: 1.2em;
    }
`

const TheButton = styled.div`
    background: white;
    font-size: 0.8em;
    color: black;
    padding: 0.2em .4em;
    cursor: pointer;
    transition: 0.2s;
    margin: 0.5em 0;
    text-align: center;

    &:hover {
        background: black;
        color: white;
    }
`

export default function Patreon() {
    const patreon = usePatreon()

    const state = patreon.gotAccess ? 'fullAccess' : patreon.username ? 'noAccess' : 'notLoggedIn'

    const logIn = () => {
        window.location.href = getPatreonLogInUrl()
    }
    const logOut = () => {
        patreon.logOut()
    }
    const openPatreon = () => {
        window.open('https://www.patreon.com/orrkislev', '_blank')
    }

    return (
        <PatreonContainer>
            <LeftSide>
                <img src={PatreonIcon} alt="Patreon logo" width="20px" height="20px" />
                <Texts>
                    {state == 'notLoggedIn' && (
                        <>
                            <div>Are you a patron?</div>
                            <div>Log in to get <strong>full access</strong></div>
                        </>
                    )}

                    {state == 'noAccess' && (
                        <>
                            <div>Hi {patreon.username}!</div>
                            <div><strong>Become a patron</strong> to gain full access!</div>
                        </>
                    )}

                    {state == 'fullAccess' && (
                        <>
                            <div>Hi <strong>{patreon.username}</strong>!</div>
                            <div>Enjoy your <strong>full access!</strong></div>
                        </>
                    )}
                </Texts>
            </LeftSide>


            {state == 'notLoggedIn' && (
                <TheButton onClick={logIn} target="_blank">
                    Log in with Patreon
                </TheButton>
            )}

            {state == 'noAccess' && (
                <div>
                    <TheButton onClick={openPatreon}> Become a patron </TheButton>
                    <TheButton onClick={logOut}> Log out </TheButton>
                </div>
            )}

            {state == 'fullAccess' && (
                <TheButton onClick={logOut}> Log out </TheButton>
            )}

        </PatreonContainer>
    )
}