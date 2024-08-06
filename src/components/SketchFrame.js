import React, { useState, useEffect, useRef } from 'react';
import useProject, { getCodeLine } from '../utils/useProject';
import { useRecoilValue } from 'recoil';
import { topBarAtom } from "./__TopBar";
import { useMonaco } from '@monaco-editor/react';

export const JSLibs = {
  matter: {
    cdn: "https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.17.1/matter.min.js",
    url: "https://brm.io/matter-js/",
    name: "Matter.js",
    desc: "2D physics engine for the web"
  },
  p5: {
    cdn: "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js",
    url: "https://p5js.org/",
    name: "p5.js",
    desc: "creative coding multi-toolkit"
  },
  paper: {
    cdn: "https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.0/paper-full.min.js",
    url: "http://paperjs.org/",
    name: "Paper.js",
    desc: "vector graphics scripting framework"
  }
}

export default function SketchFrame() {
  const projectData = useProject()
  const topBarState = useRecoilValue(topBarAtom)
  useMonaco()

  const [activeIframe, setActiveIframe] = useState(0);
  const iframeRefs = [useRef(null), useRef(null)]
  const [rerender, setRerender] = useState(false);
  const sketchContainerRef = useRef(null);

  useEffect(() => {
    if (!sketchContainerRef.current) return;
    if (!iframeRefs[0].current || !iframeRefs[1].current) return;

    const forwardMouseEvent = (event) => {
      const boundingRect = iframeRefs[0].current.getBoundingClientRect();
      const _x = event.clientX - boundingRect.left;
      const _y = event.clientY - boundingRect.top;

      const newEventProps = cloneEventProperties(event);
      newEventProps.clientX = _x;
      newEventProps.clientY = _y;

      const new_event = new MouseEvent(event.type, newEventProps);

      iframeRefs[0].current.contentWindow.dispatchEvent(new_event);
      iframeRefs[1].current.contentWindow.dispatchEvent(new_event);
    };

    const mouseEvents = ['mousemove', 'mousedown', 'mouseup', 'click', 'wheel'];
    if (iframeRefs[0].current && iframeRefs[1].current) {
      mouseEvents.forEach(eventType => {
        window.addEventListener(eventType, forwardMouseEvent);
      });
    }

    const forwardKeyboardEvent = (event) => {
      iframeRefs[0].current.contentWindow.dispatchEvent(new KeyboardEvent(event.type, event));
      iframeRefs[1].current.contentWindow.dispatchEvent(new KeyboardEvent(event.type, event));
    };

    const keyboardEvents = ['keydown', 'keyup'];
    if (iframeRefs[0].current && iframeRefs[1].current) {
      keyboardEvents.forEach(eventType => {
        window.addEventListener(eventType, forwardKeyboardEvent);
      });
    }

    return () => {
      mouseEvents.forEach(eventType => {
        window.removeEventListener(eventType, forwardMouseEvent);
      });
      keyboardEvents.forEach(eventType => {
        window.removeEventListener(eventType, forwardKeyboardEvent);
      })
    };
  }, [iframeRefs, sketchContainerRef]);


  const loadIframeContent = (iframeRef) => {
    if (iframeRef.current) {
      let snippetsCode = ''
      if (projectData.project.snippets) snippetsCode = '<script>' + Object.values(projectData.project.snippets).join('\n') + '</script>'
      iframeRef.current.srcdoc = `
      <html>
        <head>
          ${projectData.project.settings.libraries.map((lib) => `<script src="${JSLibs[lib].cdn}"></script>`).join('\n')}
        </head>
        <body style="margin: 0; overflow: hidden;">
          ${snippetsCode}
          <script> 
            const debugMode = ${topBarState.debug ? 'true' : 'false'};
            ${projectData.runningCode} 
          </script>
        </body>
      </html>
    `;
    }
  };

  useEffect(() => {
    const nextIframe = (activeIframe + 1) % 2;
    const nextIframeRef = iframeRefs[nextIframe];

    if (nextIframeRef.current) {
      loadIframeContent(nextIframeRef);

      requestAnimationFrame(() => {
        setActiveIframe(nextIframe);

        setTimeout(() => {
          if (iframeRefs[activeIframe].current) iframeRefs[activeIframe].current.srcdoc = '';
          setRerender(!rerender);
        }, 100);
      });
    }
  }, [projectData.runningCode]);

  useEffect(() => {
    if (iframeRefs[activeIframe].current) {
      const cnnt = iframeRefs[activeIframe].current.contentWindow;
      let newCode = ''
      Object.entries(projectData.project.params).forEach(([key, param]) => {
        newCode += getCodeLine(key, param)
      })
      cnnt.eval(newCode)
    }
  }, [projectData.project.params])

  useEffect(() => {
    loadIframeContent(iframeRefs[0]);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} ref={sketchContainerRef}>
      {[0, 1].map((index) => (
        <iframe
          key={index}
          ref={iframeRefs[index]}
          title={`Dynamic Iframe ${index + 1}`}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            border: 'none',
            opacity: activeIframe === index ? 1 : 0,
            pointerEvents: activeIframe === index ? 'auto' : 'none',
            transition: 'opacity 0.2s ease-in-out'
          }}
        />
      ))}
    </div>
  );
}

function cloneEventProperties(event) {
  const props = {};
  for (const key in event) {
    if (typeof event[key] !== 'function') {
      props[key] = event[key];
    }
  }
  return props;
}