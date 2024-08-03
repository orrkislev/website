export const monacoOptions = {
    language: 'javascript',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'off',
    tabSize: 2,
    fontSize: 14,
    // lineNumbers: 'off',
    libraries: {
        include: [
            '/code/p5.global-mode.d.ts'
        ]
    },
}

export async function setupMonaco(monaco) {
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
        await fetch('/code/p5.global-mode.d.ts').then(response => response.text()),
        'p5.d.ts'
    );
}

export function ApplyDecoration(editor, words, classname) {
    const model = editor.getModel();
    const findWords = () => {
        let decorations = [];
        words.forEach(word => {
            const matches = model.findMatches(word, false, false, true, null, true);
            matches.forEach(match => {
                decorations.push({
                    range: match.range,
                    options: {
                        inlineClassName: classname
                    }
                });
            });
        });
        return decorations;
    };

    let decorations = [];
    const updateDecorations = () => {
        // get previous decorations
        decorations = editor.deltaDecorations(decorations, []);
        // add new decorations
        decorations = editor.deltaDecorations(decorations, findWords());
    };
    updateDecorations();
    model.onDidChangeContent(() => {
        updateDecorations();
    });
}

export function ApplyHoverProvider(monaco, snippets) {
    return monaco.languages.registerHoverProvider('javascript', {
        provideHover: (model, position) => {
            const word = model.getWordAtPosition(position);
            if (word && snippets[word.word]) {
                return {
                    contents: [
                        { value: '### Helper Function', isTrusted: true },
                        { value: '```javascript\n' + snippets[word.word] + '\n```', isTrusted: true }
                    ]
                };
            }
        }
    });
}