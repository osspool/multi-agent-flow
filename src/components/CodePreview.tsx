import React from "react";
import { FileCode } from "lucide-react";

interface CodePreviewProps {
  filename: string;
  content: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ filename, content }) => {
  return (
    <div className="rounded-lg bg-card shadow-sm border overflow-hidden h-[calc(100vh-8rem)]">
      <div className="bg-muted/50 p-2 flex items-center gap-2 border-b">
        <FileCode className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-mono text-muted-foreground">{filename}</span>
      </div>
      <pre className="p-4 text-sm font-mono overflow-auto h-[calc(100%-2.5rem)]">
        <code>{content}</code>
      </pre>
    </div>
  );
};

export default CodePreview;