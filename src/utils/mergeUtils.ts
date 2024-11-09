interface CodeBlock {
  type: 'function' | 'class' | 'variable' | 'other';
  name: string;
  content: string;
  indentation: number;
}

const getFileType = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

const getIndentation = (line: string): number => {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
};

const parseYaml = (content: string): CodeBlock[] => {
  const lines = content.split('\n');
  const blocks: CodeBlock[] = [];
  let currentBlock = '';
  let currentIndentation = 0;

  lines.forEach((line) => {
    const indentation = getIndentation(line);
    if (indentation <= currentIndentation && currentBlock) {
      blocks.push({
        type: 'other',
        name: currentBlock.split('\n')[0].trim(),
        content: currentBlock.trim(),
        indentation: currentIndentation,
      });
      currentBlock = '';
    }
    currentBlock += line + '\n';
    currentIndentation = indentation;
  });

  if (currentBlock) {
    blocks.push({
      type: 'other',
      name: currentBlock.split('\n')[0].trim(),
      content: currentBlock.trim(),
      indentation: currentIndentation,
    });
  }

  return blocks;
};

const parsePython = (content: string): CodeBlock[] => {
  const lines = content.split('\n');
  const blocks: CodeBlock[] = [];
  let currentBlock = '';
  let currentType: CodeBlock['type'] = 'other';
  let currentName = '';
  let currentIndentation = 0;

  lines.forEach((line) => {
    if (line.trim().startsWith('def ') || line.trim().startsWith('class ')) {
      if (currentBlock) {
        blocks.push({
          type: currentType,
          name: currentName,
          content: currentBlock.trim(),
          indentation: currentIndentation,
        });
      }
      currentBlock = line;
      currentType = line.trim().startsWith('def ') ? 'function' : 'class';
      currentName = line.trim().split(' ')[1].split('(')[0];
      currentIndentation = getIndentation(line);
    } else {
      currentBlock += '\n' + line;
    }
  });

  if (currentBlock) {
    blocks.push({
      type: currentType,
      name: currentName,
      content: currentBlock.trim(),
      indentation: currentIndentation,
    });
  }

  return blocks;
};

const parseJson = (content: string): CodeBlock[] => {
  try {
    const parsed = JSON.parse(content);
    return Object.entries(parsed).map(([key, value]) => ({
      type: 'other',
      name: key,
      content: JSON.stringify({ [key]: value }, null, 2),
      indentation: 0,
    }));
  } catch {
    return [{
      type: 'other',
      name: 'root',
      content: content,
      indentation: 0,
    }];
  }
};

const parseJavaScript = (content: string): CodeBlock[] => {
  const blocks: CodeBlock[] = [];
  const lines = content.split('\n');
  let currentBlock = '';
  let currentType: CodeBlock['type'] = 'other';
  let currentName = '';
  let currentIndentation = 0;

  lines.forEach((line) => {
    if (line.includes('function') || (line.includes('const') && line.includes('=>'))) {
      if (currentBlock) {
        blocks.push({
          type: currentType,
          name: currentName,
          content: currentBlock.trim(),
          indentation: currentIndentation,
        });
      }
      currentBlock = line;
      currentType = 'function';
      const functionMatch = line.match(/(?:function|const)\s+(\w+)/);
      currentName = functionMatch ? functionMatch[1] : '';
      currentIndentation = getIndentation(line);
    } else {
      currentBlock += '\n' + line;
    }
  });

  if (currentBlock) {
    blocks.push({
      type: currentType,
      name: currentName,
      content: currentBlock.trim(),
      indentation: currentIndentation,
    });
  }

  return blocks;
};

const parseCode = (code: string, fileType: string): CodeBlock[] => {
  switch (fileType) {
    case 'yml':
    case 'yaml':
      return parseYaml(code);
    case 'py':
      return parsePython(code);
    case 'json':
      return parseJson(code);
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return parseJavaScript(code);
    default:
      return [{
        type: 'other',
        name: 'root',
        content: code,
        indentation: 0,
      }];
  }
};

export const mergeCode = (originalCode: string, aiChanges: string, filename: string): string => {
  const fileType = getFileType(filename);
  
  // Special handling for YAML files
  if (fileType === 'yml' || fileType === 'yaml') {
    const originalLines = originalCode.split('\n');
    const aiLines = aiChanges.split('\n');
    const result: string[] = [];
    const processedKeys = new Set<string>();

    // Create a map of key paths to values from AI changes
    const aiChangesMap = new Map<string, string>();
    let currentPath: string[] = [];
    
    aiLines.forEach(line => {
      const indentation = line.match(/^\s*/)?.[0].length || 0;
      const trimmedLine = line.trim();
      
      if (trimmedLine && !trimmedLine.endsWith(':')) {
        const [key, value] = trimmedLine.split(':').map(s => s.trim());
        const fullPath = [...currentPath, key].join('.');
        aiChangesMap.set(fullPath, value);
      } else if (trimmedLine) {
        const key = trimmedLine.replace(':', '');
        if (indentation === 0) {
          currentPath = [key];
        } else {
          currentPath.push(key);
        }
      }
    });

    // Process original lines and replace values
    currentPath = [];
    originalLines.forEach(line => {
      const indentation = line.match(/^\s*/)?.[0].length || 0;
      const trimmedLine = line.trim();
      
      if (trimmedLine && !trimmedLine.endsWith(':')) {
        const [key, value] = trimmedLine.split(':').map(s => s.trim());
        const fullPath = [...currentPath, key].join('.');
        
        if (aiChangesMap.has(fullPath)) {
          result.push(`${' '.repeat(indentation)}${key}: ${aiChangesMap.get(fullPath)}`);
          processedKeys.add(fullPath);
        } else {
          result.push(line);
        }
      } else if (trimmedLine) {
        const key = trimmedLine.replace(':', '');
        if (indentation === 0) {
          currentPath = [key];
        } else {
          currentPath.push(key);
        }
        result.push(line);
      } else {
        result.push(line);
      }
    });

    return result.join('\n');
  }

  // Handle other file types
  const originalBlocks = parseCode(originalCode, fileType);
  const aiBlocks = parseCode(aiChanges, fileType);
  let mergedCode = originalCode;

  aiBlocks.forEach((aiBlock) => {
    const existingBlock = originalBlocks.find(
      (block) => block.type === aiBlock.type && block.name === aiBlock.name
    );

    if (existingBlock) {
      // Update existing block while preserving indentation
      const indentedContent = aiBlock.content.split('\n')
        .map((line, i) => i === 0 ? line : ' '.repeat(existingBlock.indentation) + line)
        .join('\n');
      mergedCode = mergedCode.replace(existingBlock.content, indentedContent);
    } else {
      // Append new block
      const indentedContent = aiBlock.content.split('\n')
        .map((line, i) => i === 0 ? line : ' '.repeat(aiBlock.indentation) + line)
        .join('\n');

      if (fileType === 'yml' || fileType === 'yaml') {
        mergedCode += '\n' + indentedContent;
      } else if (fileType === 'json') {
        // For JSON, we need to parse and stringify to maintain valid JSON
        try {
          const originalJson = JSON.parse(mergedCode);
          const aiJson = JSON.parse(aiBlock.content);
          const merged = { ...originalJson, ...aiJson };
          mergedCode = JSON.stringify(merged, null, 2);
        } catch {
          mergedCode += '\n' + indentedContent;
        }
      } else {
        const lastExportIndex = mergedCode.lastIndexOf('export');
        if (lastExportIndex !== -1 && (fileType === 'ts' || fileType === 'js' || fileType === 'tsx' || fileType === 'jsx')) {
          mergedCode = mergedCode.slice(0, lastExportIndex) + 
                      '\n\n' + indentedContent + '\n\n' + 
                      mergedCode.slice(lastExportIndex);
        } else {
          mergedCode += '\n\n' + indentedContent;
        }
      }
    }
  });

  return mergedCode;
};
