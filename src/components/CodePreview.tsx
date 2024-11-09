import React, { useState } from "react";
import { FileCode } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "./ui/button";

interface CodePreviewProps {
  filename: string;
  content: string;
  originalContent?: string;
  onContentChange?: (newContent: string) => void;
  readOnly?: boolean;
}

const CodePreview: React.FC<CodePreviewProps> = ({ 
  filename, 
  content, 
  originalContent,
  onContentChange,
  readOnly = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const getDiffHighlighting = (line: string) => {
    if (!originalContent) return null;
    if (!originalContent.includes(line.trim()) && line.trim()) {
      return "bg-green-500/10 border-l-2 border-green-500";
    }
    if (originalContent.includes(line.trim()) && !content.includes(line.trim())) {
      return "bg-red-500/10 border-l-2 border-red-500";
    }
    return null;
  };

  return (
    <div className="rounded-lg bg-card shadow-sm border overflow-hidden h-[calc(100vh-8rem)]">
      <div className="bg-muted/50 p-2 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono text-muted-foreground">{filename}</span>
        </div>
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "View" : "Edit"}
          </Button>
        )}
      </div>
      {isEditing ? (
        <Editor
          height="calc(100% - 2.5rem)"
          defaultLanguage={filename.split('.').pop()}
          value={content}
          onChange={(value) => onContentChange?.(value || '')}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            readOnly: readOnly,
          }}
        />
      ) : (
        <pre className="p-4 text-sm font-mono overflow-auto h-[calc(100%-2.5rem)]">
          {content.split('\n').map((line, i) => (
            <div
              key={i}
              className={getDiffHighlighting(line)}
            >
              <code>{line}</code>
            </div>
          ))}
        </pre>
      )}
    </div>
  );
};

export default CodePreview;