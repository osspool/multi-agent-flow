interface YamlBlock {
  type: 'other';
  name: string;
  content: string;
  indentation: number;
}

const getIndentation = (line: string): number => {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
};

export const parseYaml = (content: string): YamlBlock[] => {
  const lines = content.split('\n');
  const blocks: YamlBlock[] = [];
  let currentPath: string[] = [];
  let currentBlock = '';
  let baseIndentation = -1;

  lines.forEach((line, index) => {
    const indentation = getIndentation(line);
    const trimmedLine = line.trim();
    
    if (trimmedLine) {
      if (baseIndentation === -1) {
        baseIndentation = indentation;
      }

      // Handle key-value pairs at the same level
      if (indentation <= baseIndentation) {
        if (currentBlock) {
          blocks.push({
            type: 'other',
            name: currentPath.join('.'),
            content: currentBlock.trim(),
            indentation: baseIndentation
          });
        }
        currentBlock = line;
        currentPath = [trimmedLine.split(':')[0]];
        baseIndentation = indentation;
      } else {
        currentBlock += '\n' + line;
      }
    } else {
      currentBlock += '\n' + line;
    }
  });

  if (currentBlock) {
    blocks.push({
      type: 'other',
      name: currentPath.join('.'),
      content: currentBlock.trim(),
      indentation: baseIndentation
    });
  }

  return blocks;
};