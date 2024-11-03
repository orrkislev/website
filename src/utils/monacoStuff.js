export const monacoOptions = {
    language: 'javasccript',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'off',
    tabSize: 2,
    fontSize: 14,
    lineNumbers: 'off',
    libraries: {
        include: [
            '/code/p5.global-mode.d.ts'
        ]
    },
    scrollbar: {
        vertical: 'hidden',
        horizontal: 'hidden',
        alwaysConsumeMouseWheel: false
    }
}

export const disabledMonacoOptions = {
    readOnly: true,                 // Makes the editor read-only
    domReadOnly: true,              // Prevents DOM events
    renderLineHighlight: 'none',    // Disables current line highlighting
    contextmenu: false,             // Disables context menu
    selectionHighlight: false,      // Disables selection highlighting
    renderWhitespace: 'none',       // Disables whitespace rendering
    occurrencesHighlight: false,    // Disables occurrence highlighting
    lineNumbers: 'off',             // Disables line numbers
    folding: false,                 // Disables code folding
    glyphMargin: false,             // Disables glyph margin
    lineDecorationsWidth: 0,        // Removes left margin
    lineNumbersMinChars: 0,         // Minimizes space for line numbers
    overviewRulerBorder: false,     // Removes overview ruler border
    overviewRulerLanes: 0,          // Disables overview ruler
    hideCursorInOverviewRuler: true, // Hides cursor in overview ruler
    matchBrackets: 'never',         // Disables bracket matching
    cursorStyle: 'line-thin',       // Sets a thin cursor
    cursorBlinking: 'solid',        // Makes cursor solid instead of blinking
};

export async function setupMonaco(monaco) {
    // monaco.languages.typescript.javascriptDefaults.addExtraLib(
    //     await fetch('/code/p5.global-mode.d.ts').then(response => response.text()),
    //     'p5.d.ts'
    // );
    // Register the language
    monaco.languages.register({ id: 'creativeCode' });

    // Define the token provider
    monaco.languages.setMonarchTokensProvider('creativeCode', {
        tokenizer: {
            root: [
                // JavaScript keywords
                [/\b(var|let|const|function|class|if|else|for|while|do|switch|case|break|continue|return|try|catch|throw|new|typeof|instanceof|in|of|delete|void|yield|async|await)\b/, 'keyword'],

                // JavaScript built-in objects and functions
                [/\b(Object|Array|String|Number|Boolean|Function|Symbol|Map|Set|Promise|Math|Date|RegExp|JSON|console)\b/, 'type'],

                // p5.js specific functions and keywords
                [/\b(createCanvas|background|fill|stroke|noFill|noStroke|ellipse|rect|line|point|triangle|quad|arc|beginShape|endShape|vertex|curveVertex|bezierVertex|push|pop|translate|rotate|scale|frameRate|mouseX|mouseY|keyPressed|mousePressed|setup|draw|frameCount|frameRate|strokeWeight|circle)\b/, 'p5jsKeyword'],

                // Paper.js specific functions and keywords
                [/\b(view|project|Path|Point|Rectangle|Matrix|Group|Layer|Shape|Segment|PointText|Tool|Key|Mouse|paper)\b/, 'paperjsKeyword'],

                // Numbers
                [/\b\d+(\.\d+)?\b/, 'number'],

                // Strings
                [/"([^"\\]|\\.)*"/, 'string'],
                [/'([^'\\]|\\.)*'/, 'string'],

                // Comments
                [/\/\/.*$/, 'comment'],
                [/\/\*/, 'comment', '@comment'],
            ],
            comment: [
                [/[^\/*]+/, 'comment'],
                [/\*\//, 'comment', '@pop'],
                [/[\/*]/, 'comment']
            ]
        }
    });

    // Define the theme
    monaco.editor.defineTheme('creativeCodeTheme', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
            { token: 'type', foreground: '008000' },
            { token: 'p5jsKeyword', foreground: 'FF00FF' },
            { token: 'paperjsKeyword', foreground: 'FF8C00' },
            { token: 'number', foreground: '098658' },
            { token: 'string', foreground: 'A31515' },
            { token: 'comment', foreground: '008000', fontStyle: 'italic' }
        ],
        colors: {
            'editor.foreground': '#000000',
            'editor.background': '#FFFFFF',
            'editor.lineHighlightBackground': '#F0F0F0',
            'editorCursor.foreground': '#000000',
            'editor.selectionBackground': '#ADD6FF',
        }
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,
        noLib: true
    });
    const p5Types = await fetch('/code/p5.global-mode.d.ts').then(response => response.text());
    monaco.languages.typescript.javascriptDefaults.addExtraLib(p5Types, 'p5.d.ts');
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
        decorations = editor.deltaDecorations(decorations, []);
        decorations = editor.deltaDecorations(decorations, findWords());
    };
    updateDecorations();
    model.onDidChangeContent(() => {
        updateDecorations();
    });
}

export function applyLineDecoration(editor, className, condition = () => true) {
    const model = editor.getModel();
    const linesToDecorate = []
    for (let i = 1; i <= model.getLineCount(); i++) {
        if (condition(model.getLineContent(i))) {
            linesToDecorate.push(i);
        }
    }

    const updateDecorations = () => {
        const decorations = []
        linesToDecorate.forEach(line => {
            decorations.push({
                range: new monaco.Range(line, 1, line, 1),
                options: {
                    isWholeLine: true,
                    linesDecorationsClassName: className
                }
            });
        });
    };
    updateDecorations();
    model.onDidChangeContent(() => {
        updateDecorations();
    });
}

export function ApplyHoverProvider(monaco, snippets) {
    return monaco.languages.registerHoverProvider('creativeCode', {
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