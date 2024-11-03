import { useMonaco } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import useProject from '../../utils/useProject';
import { setupMonaco } from '../../utils/monacoStuff';
import '../__Editor.css';
import { Appearing, FullScreenContainer } from './FullScreen';
import { useRecoilValue } from 'recoil';
import { sideBarAtom } from './SideBar';
import Code from './Editor/Code';
import tw from 'tailwind-styled-components';



export default function Study() {
    const sideBarState = useRecoilValue(sideBarAtom)
    const project = useProject()
    const codeParts = useRef()
    const monaco = useMonaco()

    useEffect(() => {
        if (monaco) setupMonaco(monaco)
    }, [monaco])

    useEffect(() => {
        if (project.project.files) {
            codeParts.current = project.project.files.map((f) => f.content)
        }
    }, [project.project.files])

    const updateCode = (i, value) => {
        codeParts.current[i] = value
        project.setAllCode(codeParts.current.join('\n'))
    }

    const isActive = sideBarState == 'STUDY'

    return (
        <FullScreenContainer $isTop={isActive}>
            {project.project.files && project.project.files.filter(f => !f.hidden).map((f, i) => (
                <Appearing active={isActive} key={i}>
                    <Code key={i}
                        file={f}
                        onChange={(value) => updateCode(i, value)}
                    />
                </Appearing>
            ))}
            <div className='mb-32' />
        </FullScreenContainer>
    )
}
