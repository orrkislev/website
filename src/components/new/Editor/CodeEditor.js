import MonacoEditor from '@monaco-editor/react';
import useProject from '../../../utils/useProject';
import { useRef, useState } from 'react';
import { ApplyDecoration, ApplyHoverProvider, applyLineDecoration, disabledMonacoOptions, monacoOptions } from '../../../utils/monacoStuff';
import tw from 'tailwind-styled-components';
import { SyncOutlined } from '@ant-design/icons';
import { AnimatePresence, motion } from 'framer-motion';

const Container = tw.div`flex-1 w-full rounded-lg bg-white bg-opacity-50 backdrop-blur-sm py-4 mb-4 overflow-hidden relative
    ${props => props.$editable ? '' : 'bg-opacity-10'}`
const Gradient = tw.div`absolute inset-0 z-10 bg-gradient-to-b from-white to-black opacity-10`
const GrayScale = tw.div`absolute backdrop-filter backdrop-grayscale inset-0 z-10`
const Dot = tw(motion.div)`w-8 h-8 bg-white rounded-full absolute top-2 right-2 cursor-pointer flex items-center justify-center z-20
    hover:bg-gray-200 hover:shadow-md`



export default function CodeEditor({ code, onChange, editable }) {
    const project = useProject()
    const editorRef = useRef(null)
    const [madeChanges, setMadeChanges] = useState(false)

    const initEditor = (editor) => {
        editorRef.current = editor;
        if (project.project.snippets)
            ApplyDecoration(editorRef.current, Object.keys(project.project.snippets), 'helperFunctionHighlight');
        ApplyDecoration(editorRef.current, ['debugMode'], 'debugModeHighlight');
        if (project.project.params)
            ApplyDecoration(editorRef.current, Object.keys(project.project.params), 'parameterHighlight');
        ApplyHoverProvider(monaco, project.project.snippets);

        applyLineDecoration(editorRef.current, 'diffLineHighlight', (line) => line.startsWith('!!!'));

        // set Editor size
        const numOfLines = editorRef.current.getModel().getLineCount();
        const lineHeight = editorRef.current.getOption(monaco.editor.EditorOption.lineHeight);
        const totalHeight = numOfLines * lineHeight;
        editorRef.current.layout({ height: totalHeight });
    }

    const reset = () => {
        if (editorRef.current) editorRef.current.setValue(code)
        setMadeChanges(false)
    }

    const handleChange = (value) => {
        setMadeChanges(true)
        onChange(value)
    }


    let options = { ...monacoOptions }
    if (!editable) options = { ...options, ...disabledMonacoOptions }
    return (
        <Container $editable={editable}>
            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <MonacoEditor
                    key={editable}
                    language='creativeCode'
                    theme='creativeCodeTheme'
                    defaultValue={code}
                    onMount={initEditor}
                    options={options}
                    onChange={handleChange}
                />
            </div>
            {!editable && (
                <>
                    <Gradient />
                    <GrayScale />
                </>
            )}
            <AnimatePresence>
                {madeChanges && (
                    <Dot onClick={reset}
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0}}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ duration: 0.2, type: 'spring', stiffness: 200 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    ><SyncOutlined /></Dot>
                )}
            </AnimatePresence>
        </Container>
    )
}