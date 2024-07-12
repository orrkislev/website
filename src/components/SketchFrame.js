import React, { useState, useEffect, useRef } from 'react';
import useProject from '../utils/useProject';

const libs = {
  matter: "https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.17.1/matter.min.js",
  p5: "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js",
  paper: "https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.0/paper-full.min.js"
}

export default function SketchFrame() {
  const projectData = useProject()

  const [activeIframe, setActiveIframe] = useState(0);
  const iframeRefs = [useRef(null), useRef(null)]
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    const forwardEvent = (event) => {
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

    const events = ['mousemove', 'mousedown', 'mouseup', 'click', 'wheel'];
    if (iframeRefs[0].current && iframeRefs[1].current) {
      events.forEach(eventType => {
        window.addEventListener(eventType, forwardEvent);
      });
    }

    return () => {
      events.forEach(eventType => {
        window.removeEventListener(eventType, forwardEvent);
      });
    };
  }, [iframeRefs]);

  const generateIframeContent = () => {
    return `
      <html>
        <head>
          ${projectData.project.settings.libraries.map((lib) => `<script src="${libs[lib]}"></script>`).join('\n')}
        </head>
        <body style="margin: 0; overflow: hidden;">
          <script>
            ${projectData.allCode}
          </script>
        </body>
      </html>
    `;
  };


  const loadIframeContent = (iframeRef) => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = generateIframeContent();
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
  }, [projectData.allCode]);

  useEffect(() => {
    loadIframeContent(iframeRefs[0]);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
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