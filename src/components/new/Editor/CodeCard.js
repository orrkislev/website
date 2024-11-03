import tw from "tailwind-styled-components"
import { useUser } from "../../../utils/useUser"
import { LogInBGStyle } from "../AdStuff"
import { useRecoilValue } from "recoil"
import { accessControlAtom } from "../../../utils/accessControl"

const Container = tw.div`sticky flex flex-col rounded-lg bg-white bg-opacity-50 backdrop-blur-sm p-4 w-64 mb-4`
const Title = tw.h1`mb-1 font-bold text-xl`
const Description = tw.p`text-s mb-8`

const ButtonContainer = tw.div`space-y-1 mb-4`
const EditButton = tw.button`w-full py-1 text-black rounded-full border-2 border-black
    hover:bg-black hover:text-white hover:border-transparent transition-colors duration-200
    ${(p) => (p.$enabled ? "" : "opacity-50 pointer-events-none")}`
const MagicButton = tw.button`w-full py-1 font-bold
    bg-gradient-to-r from-red-100 via-orange-200 to-purple-300 text-white rounded-full
    border-2 border-indigo-200 cursor-not-allowed`

const Seperator = tw.div`h-px bg-black opacity-30 rounded-full my-2`

const Section = tw.section`mb-2`
const SectionTitle = tw.h2`text-s mb-2`

const TodoList = tw.div`text-xs space-y-2 mb-2`
const TodoItem = tw.div`flex items-center justify-between italic`
const Checkbox = tw.div`h-6 w-6 border-2 border-gray-400 rounded`

const NoticeText = tw.p`text-xs`

export default function CodeCard({ file, onEdit, editable}) {
    const user = useUser()
    const title = file.title ? file.title.replace('_', ' ') : file.name.replace('_', ' ')

    const canEdit = user.getPlan() != 'none'

    return (
        <div>
            <Container>
                <Title>{title}</Title>

                <Description>{file.description}</Description>

                <ButtonContainer>
                    <LimitedAccess />
                    <EditButton onClick={onEdit} $enabled={canEdit}>Edit</EditButton>
                    <MagicButton>Magic</MagicButton>
                </ButtonContainer>

                {file.notes && (
                    <Section>
                        <Seperator />
                        <SectionTitle>Stuff to try</SectionTitle>
                        <TodoList>
                            {file.notes.map(note => (
                                <TodoItem key={note}>
                                    <span>{note}</span>
                                </TodoItem>
                            ))}
                        </TodoList>
                    </Section>
                )}

                <Section>
                    <Seperator />
                    <SectionTitle>Things to notice</SectionTitle>
                    <NoticeText>
                        This is the main code.<br />
                        is does lots of things.
                    </NoticeText>
                </Section>
            </Container>
        </div>
    )
}





const LimitedAccessContainer = tw.div`mt-4 justify-center flex flex-col p-4 bg-white bg-opacity-50 backdrop-blur-sm rounded-lg w-full h-full shadow-md`
const LoginButton = tw.button`mt-4 border-2 text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-200`

function LimitedAccess() {
    const accessControl = useRecoilValue(accessControlAtom)
    if (!accessControl.limitations.includes('edit')) return null
    return (
        <LimitedAccessContainer style={LogInBGStyle}>
            <p className="text-white text-sm" style={{ textShadow: '0 0 5px black' }}>Sign in for FREE to Edit</p>
            <LoginButton onClick={user.login}>Sign In</LoginButton>
        </LimitedAccessContainer>
    )
}