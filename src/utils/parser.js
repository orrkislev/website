import { Parser } from 'htmlparser2';

export function parseFile(content) {
  const lines = content.split('\n');
  const result = [];
  const stack = [];
  let currentSection = null;
  let sectionContent = [];
  let attributeLines = [];

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
    attributeLines = [];
  }

  function endSection(type) {
    if (currentSection && currentSection.type === type.toLowerCase()) {
      currentSection.content = sectionContent.join('\n').trim();
      currentSection.original = [...attributeLines, ...sectionContent].join('\n').trim();
      if (stack.length > 0) {
        currentSection = stack.pop();
      } else {
        currentSection = null;
      }
      sectionContent = [];
      attributeLines = [];
    } else {
      console.warn(`Mismatched end tag: ${type}`);
    }
  }

  function parseAttribute(line) {
    const match = line.trim().slice(3).match(/^(\w+)\s+(.+)$/);
    if (match) {
      const [, key, value] = match;
      if (key.toLowerCase().endsWith('s')) {
        currentSection[key] = value.split(',').map(tag => tag.trim());
      } else {
        currentSection[key] = value.trim();
      }
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
    } else if (line.trim().startsWith('//.') && currentSection) {
      attributeLines.push(line);
      parseAttribute(line);
    } else if (currentSection) {
      sectionContent.push(line);
    }
  }

  // Handle any unclosed sections
  while (stack.length > 0) {
    console.warn(`Unclosed section: ${currentSection.type}`);
    endSection(currentSection.type);
  }

  return result;
}

export function parseExplanation(txt) {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(txt, 'text/html');

  let result = {}
  if (htmlDoc.getElementsByTagName('title').length > 0) 
    result.title = htmlDoc.getElementsByTagName('title')[0].innerHTML;
  if (htmlDoc.getElementsByTagName('subtitle').length > 0)
    result.subtitle = htmlDoc.getElementsByTagName('subtitle')[0].innerHTML;

  result.cards = [];
  const cards = htmlDoc.getElementsByTagName('card');
  Array.from(cards).forEach(card => {
    const cardData = {}
    if (card.getElementsByTagName('title').length > 0)
      cardData.title = card.getElementsByTagName('title')[0].innerHTML;
    if (card.getElementsByTagName('subtitle').length > 0)
      cardData.subtitle = card.getElementsByTagName('subtitle')[0].innerHTML;
    if (card.getElementsByTagName('content').length > 0)
      cardData.content = card.getElementsByTagName('content')[0].innerHTML;
    result.cards.push(cardData);
  });

  return result;
}