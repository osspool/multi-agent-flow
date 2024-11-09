import React from "react";
import { FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileExplorerProps {
  files: Record<string, string>;
  selectedFile: string | null;
  onFileSelect: (filename: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  selectedFile,
  onFileSelect,
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
          <span className="text-sm font-mono">{filename}</span>
        </div>
      ))}
    </div>
  );
};

export default FileExplorer;