import tw from "tailwind-styled-components"
import CodeCard from "./CodeCard"
import CodeEditor from "./CodeEditor"
import { useState } from "react"

const Container = tw.div`flex flex-row gap-4 w-11/12`

export default function Code({ file, onChange }) {
    const [changed, setChanged] = useState(false)
    const [resetCode, setCode] = useState(true)
    const [editable, setEditable] = useState(false)

    const handleChange = (value) => {
        onChange(value)
        setChanged(true)
    }
    const handleReset = () => {
        setCode(!resetCode)
        setChanged(false)
        onChange(file.content)
    }
    const handleEdit = () => {
        setEditable(!editable)
    }

    return (
        <Container>
            <CodeCard file={file} withReset={changed && editable} onReset={handleReset} onEdit={handleEdit} editable={editable}/>
            <CodeEditor code={file.content} onChange={handleChange} triggerReset={resetCode} editable={editable}/>
        </Container>
    )
}
