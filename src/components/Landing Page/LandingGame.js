const GameContainer = ({ children }) => (
    <div style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        bottom: '10em',
        borderRadius: '1em',
        background: 'linear-gradient(120deg, #f1f1f1 0%, #ffffff 100%)',
    }}>
        {children}
    </div>
);

export default function LangingGame() {
    return (
        <GameContainer>
            HI
        </GameContainer>
    )
}