import ReactGA from 'react-ga4';
import CookieConsent from "react-cookie-consent";
import { useEffect } from 'react';

const TRACKING_ID = "G-4TBZDMD106"

export default function Concent() {
    const { name } = useParams();

    useEffect(() => {
        ReactGA.gtag('concent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied'
        });
    }, [])

    const onAccept = (acceptedByScrolling) => {
        ReactGA.gtag('consent', 'update', {
            'ad_user_data': 'granted',
            'ad_personalization': 'granted',
            'ad_storage': 'granted',
            'analytics_storage': 'granted'
        });
        ReactGA.initialize(TRACKING_ID);
        ReactGA.send({ hitType: "pageview", page: name, title: "Project" + name });
    }
    const onDecline = () => {
        console.log("Cookies declined")
    }

    return (
        <CookieConsent
            location="bottom"
            buttonText="Allow Cookie.js"
            enableDeclineButton
            declineButtonText="Decline"
            cookieName="myAwesomeCookieName2"
            style={{ background: "#2B373B" }}
            buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
            expires={150}
            onAccept={onAccept}
            onDecline={onDecline}
        >
            🎨 I've sprinkled some cookies to render your experience in high-res.{" "}
            {/* <span style={{ fontSize: "10px" }}>Optimize your creative buffer with our data caching algorithm.</span> */}
        </CookieConsent>
    )
}