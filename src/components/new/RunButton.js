import tw from "tailwind-styled-components"
import useProject from "../../utils/useProject"

const Button = tw.button`fixed top-6 left-[50%] w-64 py-1 bg-black text-white rounded-full fixed z-10 transform -translate-x-1/2
    hover:bg-cyan-800 hover:shadow-white hover:shadow-lg transition-all duration-200`

export default function RunButton() {
    const project = useProject()

    return (
        <Button onClick={project.rerun}>
            RUN
        </Button>
    )
}