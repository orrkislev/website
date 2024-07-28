/**
 * @typedef {Object} ParsedSection
 * @property {string} type - The type of the section
 * @property {string} [name] - The name of the section (if applicable)
 * @property {string} content - The processed content of the section
 * @property {string} original - The original, unprocessed content of the section
 * @property {ParsedSection[]} [children] - An array of child sections (if any)
 */

/**
 * Parses the content of a file containing structured sections
 * @param {string} content - The content of the file
 * @returns {ParsedSection[]} An array of parsed sections
 */
export default function parseFile(content) {
    const lines = content.split('\n');
    const result = [];
    const stack = [];
    let currentSection = null;
    let sectionContent = [];

    function startSection(type, name) {
        const newSection = {
            type: type.toLowerCase(),
            name: name,
            content: '',
            original: '',
            children: []
        };
        if (currentSection) {
            currentSection.children.push(newSection);
            stack.push(currentSection);
        } else {
            result.push(newSection);
        }
        currentSection = newSection;
        sectionContent = [];
    }

    function endSection(type) {
        if (currentSection && currentSection.type === type.toLowerCase()) {
            currentSection.content = sectionContent.join('\n').trim();
            currentSection.original = currentSection.content;
            if (stack.length > 0) {
                currentSection = stack.pop();
            } else {
                currentSection = null;
            }
            sectionContent = [];
        } else {
            console.warn(`Mismatched end tag: ${type}`);
        }
    }

    for (const line of lines) {
        if (line.trim().startsWith('//:')) {
            const match = line.trim().slice(3).match(/(\S+)(?:\s+(\S+))?(?:\s+(.+))?/);
            if (match) {
                const [, type, nameOrEnd, rest] = match;
                if (nameOrEnd && nameOrEnd.toLowerCase() === 'end') {
                    endSection(type);
                } else {
                    startSection(type, nameOrEnd);
                    if (rest) sectionContent.push(rest);
                }
            }
        } else {
            sectionContent.push(line);
            if (currentSection) {
                currentSection.original += line + '\n';
            }
        }
    }

    // Handle any unclosed sections
    while (stack.length > 0) {
        console.warn(`Unclosed section: ${currentSection.type}`);
        endSection(currentSection.type);
    }

    return result;
}