export type FileType = 'typescript' | 'javascript' | 'yaml' | 'json' | 'other';

export const getFileType = (filename: string): FileType => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'json':
      return 'json';
    default:
      return 'other';
  }
};

export const extractCodeFromMarkdown = (markdown: string, fileType: FileType): string => {
  const codeBlockRegex = new RegExp(`\`\`\`(?:${fileType})?\\n([\\s\\S]*?)\`\`\``, 'g');
  const matches = [...markdown.matchAll(codeBlockRegex)];
  return matches.map(match => match[1].trim()).join('\n\n');
};

export const extractAiMessage = (markdown: string): string => {
  return markdown.replace(/```[\s\S]*?```/g, '').trim();
};