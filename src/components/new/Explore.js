import { useRecoilValue } from "recoil";
import { Appearing, FullScreenContainer, withGlass } from "./FullScreen";
import { sideBarAtom } from "./SideBar";
import useProject from "../../utils/useProject";
import tw from "tailwind-styled-components";
import { useState } from "react";

const Container = tw.div`flex flex-wrap gap-4 mt-24`
const Card = withGlass(`relative w-96 flex-col rounded-xl bg-white text-gray-700 shadow-md overflow-hidden p-0`)
const Top = tw.div`bg-white w-full bg-opacity-20 backdrop-blur-2xl`
const Section = tw.div`p-4`
const Title = tw.h5`mb-2 block font-sans font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased`
const Description = tw.p`mb-2 block font-sans text-base font-light leading-relaxed text-inherit antialiased`
const Button = tw.button`select-none rounded-full bg-black py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white w-full`
const MadeBy = tw.p`text-xs font-sans font-light text-center`



export default function Explore() {
    const project = useProject()
    const sideBarState = useRecoilValue(sideBarAtom)
    const isActive = sideBarState == 'EXPLORE'
    const [currVariation, setCurrVariation] = useState('default')

    const clickHandler = (v) => {
        setCurrVariation(v.name)
        project.applyVariation(v)
    }

    const variations = [...project.project.variations]
    variations.unshift({ name: 'original' })

    return (
        <FullScreenContainer $isTop={isActive}>
                <Container>
                    {variations.map((v, i) => (
                        <Appearing key={i} active={isActive}>
                            <Card className={currVariation == v.name ? 'bg-opacity-80 border-2 border-black' : ''}>
                                <Top>
                                    <MadeBy>made by Orr Kislev</MadeBy>
                                </Top>
                                <Section>
                                    <Title>{v.name}</Title>
                                    <Description>this is the description</Description>
                                    {currVariation != v.name && <Button onClick={() => clickHandler(v)}>View</Button>}
                                </Section>
                            </Card>
                        </Appearing>
                    ))}
                </Container>
        </FullScreenContainer>
    )
}