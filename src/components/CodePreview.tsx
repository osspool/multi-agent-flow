import React from "react";
import { FileCode } from "lucide-react";

interface CodePreviewProps {
  filename: string;
  content: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ filename, content }) => {
  return (
    <div className="rounded-lg bg-white shadow-lg overflow-hidden">
      <div className="bg-gray-100 p-2 flex items-center gap-2 border-b">
        <FileCode className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-mono">{filename}</span>
      </div>
      <pre className="p-4 text-sm font-mono overflow-x-auto">
        <code>{content}</code>
      </pre>
    </div>
  );
};

export default CodePreview;