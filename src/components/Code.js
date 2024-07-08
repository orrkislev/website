import React, { useEffect, useRef, useState } from 'react';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import styled from "styled-components";
import "monaco-themes/themes/Monokai.json";
import { setupMonaco } from '../utils/monacoStuff';

const options = {
  language: 'javascript',
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  theme: 'monokai',
  tabSize: 2,
  fontSize: 14,
  libraries: {
    include: [
      '/code/p5.global-mode.d.ts'
    ]
  },
};

const FullScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #34352F;
  height: 3em;
  align-items: center;
  justify-content: space-between;
`

const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3px;
`;
const Tab = styled.div`
  display: inline-block;
  padding: 1em 10px;
  background-color: ${(props) => (props.isactive ? "white" : "#34352F")};
  color: ${(props) => (props.isactive ? "black" : "#8C8C8C")};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
`;

const CommentsSection = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  font-size: 20px;
  font-family: courier;
  font-weight: bold;
  line-height: 1.5;
  padding: 10px;
  cursor: pointer;
  background-color: #34352Faa;
  padding: 2em;
  backdrop-filter: blur(5px);
  color: white;
  font-size: 20px;
`;

const RunButton = styled.button`
  background-color: #74C991;
  color: #34352F;
  padding: 10px;
  cursor: pointer;
  border: none;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  transition: all 0.2s;
  position: absolute;
  bottom: 25px;
  right: 25px;
  z-index: 100;
  &:hover {
    background-color: #34352F;
    color: #74C991;
  } 
`;

export default function Code({ files, settings }) {
  const editorRef = useRef(null);
  const canvasRef = useRef(null);
  const [filesData, setFilesData] = useState(files.map(() => ({ changed: false, view: 'comment' })))
  const [showExplanation, setShowExplanation] = useState(true);
  const [fileIndex, setFileIndex] = useState(-1);
  const monaco = useMonaco()
  const scriptRef = useRef(null);
  const p5Instance = useRef(null);
  const globals = useRef([]);

  useEffect(() => {
    startStuff();
  }, [monaco])

  const startStuff = async () => {
    if (!monaco) return;
    await setupMonaco(monaco);
    const allModels = monaco.editor.getModels();
    files.forEach((f) => {
      const model = allModels.find((m) => m.uri.path === '/' + f.name);
      if (model) model.dispose();
      monaco.editor.createModel(f.code, 'javascript', monaco.Uri.parse('/' + f.name), options);
    })
    setFileIndex(0);
    runCode()
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey && e.key === 'Enter') {
        runCode();
      }
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      files.forEach((f) => {
        const prevScript = document.querySelector(`script[name="${f.name}"]`);
        if (prevScript) document.body.removeChild(prevScript);
      });
    }
  }, []);


  const runCode = () => {
    window.setup = undefined;
    window.draw = undefined;
    if (scriptRef.current) document.body.removeChild(scriptRef.current);
    canvasRef.current.innerHTML = '';

    let allCode = ''
    const allModels = monaco.editor.getModels();
    files.forEach((f) => {
      const model = allModels.find((m) => m.uri.path === '/' + f.name);
      allCode += model.getValue() + '\n';
    })

    allCode = `(function() {
      ${allCode}
      if (typeof setup !== 'undefined') window.setup = setup;
      if (typeof draw !== 'undefined') window.draw = draw;
    })();`


    const script = document.createElement('script');
    script.name = 'script';
    script.innerHTML = allCode;
    document.body.appendChild(script);
    scriptRef.current = script;

    if (p5Instance.current) p5Instance.current.remove();
    p5Instance.current = new p5(null, canvasRef.current);

  }




  const file = fileIndex === -1 ? null : files[fileIndex];

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <TopBar>
        <TabContainer>
          {files.map((f, i) => (
            <Tab key={i} onClick={() => setFileIndex(i)} isactive={i === fileIndex ? 1 : 0}>
              {f.name}
              {filesData[i].changed && '*'}
            </Tab>
          ))}
        </TabContainer>
        <TabContainer>
          {settings.libraries.map((lib, i) => (
            <Tab key={i}>{lib}</Tab>
          ))}
        </TabContainer>
      </TopBar>


      <div style={{ position: 'relative', height: '100%' }}>
        <FullScreen style={{ zIndex: 10 }}>
          <div ref={canvasRef}></div>
        </FullScreen>

        {fileIndex !== -1 && (
          <FullScreen style={{ zIndex: 10 }}>
            <MonacoEditor
              width="100%"
              height="100%"
              path={file.name}
              onChange={(value) => {
                const newFileData = [...filesData];
                newFileData[fileIndex].changed = true;
                setFilesData(newFileData);
              }}
              onMount={(editor) => editorRef.current = editor}
              options={options}
            />
          </FullScreen>
        )}

        {showExplanation && (
          <FullScreen style={{ zIndex: 20 }} >
            <CommentsSection onClick={() => setShowExplanation(!showExplanation)}>
              {settings.explanation.split('\n').map((line, i) => (
                <div key={i}>{line}<br /></div>
              ))}
            </CommentsSection>
          </FullScreen>
        )}

        <RunButton onClick={runCode}>Run Code</RunButton>
      </div>


      <style jsx="true">
        {`
        .current-line {
          background-color: #ffffffaa;
          border: none;
        }
        .monaco-editor, .monaco-editor-background {
          background-color: transparent !important;
        }
        .monaco-editor {
          --vscode-editor-selectionBackground: #74C991 !important;
          --vscode-editorGutter-background: transparent !important;
        }
        .view-line span{
          background-color: white;
          }
          .mtk8{
            background-color: #4B8A6A !important;
            color: white;
          }
        `}
      </style>
    </div>
  );
};