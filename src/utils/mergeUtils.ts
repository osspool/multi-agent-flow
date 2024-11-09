interface CodeBlock {
  type: 'function' | 'class' | 'variable' | 'other';
  name: string;
  content: string;
}

const extractFunctionName = (code: string): string | null => {
  const functionMatch = code.match(/(?:function|const)\s+(\w+)/);
  return functionMatch ? functionMatch[1] : null;
};

const parseCode = (code: string): CodeBlock[] => {
  // Split code into blocks (functions, classes, etc.)
  const blocks: CodeBlock[] = [];
  const lines = code.split('\n');
  let currentBlock = '';
  let currentType: CodeBlock['type'] = 'other';
  let currentName = '';

  lines.forEach((line) => {
    if (line.includes('function') || line.includes('const') && line.includes('=>')) {
      if (currentBlock) {
        blocks.push({ type: currentType, name: currentName, content: currentBlock.trim() });
      }
      currentBlock = line;
      currentType = 'function';
      currentName = extractFunctionName(line) || '';
    } else {
      currentBlock += '\n' + line;
    }
  });

  if (currentBlock) {
    blocks.push({ type: currentType, name: currentName, content: currentBlock.trim() });
  }

  return blocks;
};

export const mergeCode = (originalCode: string, aiChanges: string, fileType: string): string => {
  const originalBlocks = parseCode(originalCode);
  const aiBlocks = parseCode(aiChanges);
  let mergedCode = originalCode;

  aiBlocks.forEach((aiBlock) => {
    if (aiBlock.type === 'function') {
      const existingBlock = originalBlocks.find(
        (block) => block.type === 'function' && block.name === aiBlock.name
      );

      if (existingBlock) {
        // Update existing function
        mergedCode = mergedCode.replace(existingBlock.content, aiBlock.content);
      } else {
        // Append new function
        if (fileType === 'ts' || fileType === 'js' || fileType === 'tsx') {
          // For JS/TS files, append before the last export statement
          const lastExportIndex = mergedCode.lastIndexOf('export');
          if (lastExportIndex !== -1) {
            mergedCode = mergedCode.slice(0, lastExportIndex) + 
                        '\n\n' + aiBlock.content + '\n\n' + 
                        mergedCode.slice(lastExportIndex);
          } else {
            mergedCode += '\n\n' + aiBlock.content;
          }
        } else {
          // For other file types, simply append at the end
          mergedCode += '\n\n' + aiBlock.content;
        }
      }
    }
  });

  return mergedCode;
};