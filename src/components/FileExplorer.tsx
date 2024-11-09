import React from "react";
import { FileCode, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileExplorerProps {
  files: Record<string, string>;
  selectedFile: string | null;
  onFileSelect: (filename: string) => void;
  aiUpdatedFiles: Set<string>;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  selectedFile,
  onFileSelect,
  aiUpdatedFiles,
}) => {
  return (
    <div className="h-full border-r p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Files</h2>
      {Object.entries(files).map(([filename]) => (
        <div
          key={filename}
          className={cn(
            "p-2 rounded cursor-pointer flex items-center gap-2 transition-colors",
            selectedFile === filename
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50"
          )}
          onClick={() => onFileSelect(filename)}
        >
          <FileCode className="w-4 h-4" />
          <span className="text-sm font-mono flex-1">{filename}</span>
          {aiUpdatedFiles.has(filename) && (
            <Sparkles className="w-4 h-4 text-purple-500" />
          )}
        </div>
      ))}
    </div>
  );
};

export default FileExplorer;