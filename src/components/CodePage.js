import { useEffect, useState } from "react";
import Code from "./Code";

const filename = 'genuary-physics';

export default function CodePage() {
  const [data, setData] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch(`/code/${filename}.js`)
      .then((response) => response.text())
      .then((text) => {
        const settingsRegex = /\/\/SETTINGS\n(.*?)\n\/\/SETTINGSEND/s;
        const match = settingsRegex.exec(text);
        const settingsObject = match ? JSON.parse(match[1]) : {};

        const explanationRegex = /\/\/EXPLANATION\n(.*?)\n\/\/EXPLANATIONEND/s;
        const explanationMatch = explanationRegex.exec(text);
        settingsObject.explanation = explanationMatch ? explanationMatch[1] : '';

        let parts = text.split('//FILE ');
        parts.shift();
        parts = parts.map((part) => {
          if (part.includes('//COMMENTS')) {
            const [name, rest] = part.split('\n//COMMENTS\n');
            const [comment, code] = rest.split('\n//CODE\n');
            return { name: name.trim(), comment, code };
          } else {
            const [name, code] = part.split('\n//CODE\n');
            return { name: name.trim(), code, comment: '' };
          }
        });
        parts.forEach((part) => {
          part.functions = (part.code.match(/function (\w+)/g) || []).map((match) => match.replace('function ', ''));
          part.variables = (part.code.match(/(?:const|let) (\w+)/g) || []).map((match) => match.replace(/(?:const|let) /, ''));
        })
        setData({ settings: settingsObject, files: parts });
        setReady(true);
        // if (settingsObject.libraries) loadLibraries(settingsObject.libraries);
        // else setReady(true);
      });
  }, []);

  // const loadLibraries = async (libraries) => {
  //   await Promise.all(libraries.map((lib) => {
  //     return new Promise((resolve, reject) => {
  //       const script = document.createElement('script');
  //       script.src = libs[lib];
  //       script.onload = resolve;
  //       script.onerror = reject;
  //       document.head.appendChild(script);
  //     });
  //   }));
  //   setReady(true);
  // }

  if (!ready) return <div>Loading...</div>;
  return <Code {...data} />
}