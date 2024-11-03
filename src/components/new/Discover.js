import { useRecoilState, useRecoilValue } from "recoil";
import useProject from "../../utils/useProject";
import { sideBarAtom } from "./SideBar";
import { Appearing, FullScreenContainer, withGlass } from "./FullScreen";
import tw from "tailwind-styled-components";

const Container = tw.div`mt-16 grid grid-cols-6 justify-center gap-4`

const Main = withGlass('w-full h-full text-center flex items-center justify-center');
// export const Card = withGlass('max-w-md mx-auto');
// export const Panel = withGlass('shadow-lg border border-white/10');

// const Main = tw.div`rounded-lg bg-white bg-opacity-50 backdrop-blur-sm p-4 w-64 w-full h-full text-center flex items-center justify-center`
const Title = tw.div`text-6xl font-bold font-serif mb-[-0.2em] `;
const Subtitle = tw.div`text-4xl font-serif`;

const Card = withGlass(`text-[#2F242C]`)
const CardTitle = tw.div`text-base font-bold`;
const CardSubtitle = tw.div`text-sm italic`;
const CardContent = tw.div`text-xs`;
const Bottom = tw.div`absolute bottom-0 left-0 w-full text-s font-mono text-sm text-opacity-50`


export default function Discover() {
    const project = useProject()
    const [sideBarState, setSideBarState] = useRecoilState(sideBarAtom)

    const isActive = sideBarState == 'DISCOVER'

    const exp = project.project.explanation
    return (
        <FullScreenContainer $isTop={isActive}>
            <Container>
                {exp.title && (
                    <Appearing active={isActive} className="col-span-4">
                        <Main>
                            <div>
                                <Title>{exp.title}</Title>
                                <Subtitle>{exp.subtitle}</Subtitle>
                            </div>
                        </Main>
                    </Appearing>
                )}
                {exp.cards && exp.cards.map((card, i) => (
                    <Appearing key={i} active={isActive} className="col-span-2">
                        <Card>
                            <CardTitle>{card.title}</CardTitle>
                            <CardSubtitle>{card.subtitle}</CardSubtitle>
                            <CardContent dangerouslySetInnerHTML={{ __html: card.content }} />
                        </Card>
                    </Appearing>
                ))}
                {exp.cards && exp.cards.map((card, i) => (
                    <Appearing key={i} active={isActive} className="flex-1">
                        <Card>
                            <CardTitle>{card.title}</CardTitle>
                            <CardSubtitle>{card.subtitle}</CardSubtitle>
                            <CardContent dangerouslySetInnerHTML={{ __html: card.content }} />
                        </Card>
                    </Appearing>
                ))}
                {exp.cards && exp.cards.map((card, i) => (
                    <Appearing key={i} active={isActive} className="flex-1">
                        <Card>
                            <CardTitle>{card.title}</CardTitle>
                            <CardSubtitle>{card.subtitle}</CardSubtitle>
                            <CardContent dangerouslySetInnerHTML={{ __html: card.content }} />
                        </Card>
                    </Appearing>
                ))}
            </Container>
            <Bottom>
                <Appearing active={!isActive}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}>
                    {exp.title} - {exp.subtitle}
                </Appearing>
            </Bottom>
        </FullScreenContainer>
    )
}