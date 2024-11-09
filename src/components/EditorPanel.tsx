import React from "react";
import { Button } from "./ui/button";
import CodePreview from "./CodePreview";

interface EditorPanelProps {
  selectedFile: string | null;
  files: Record<string, string>;
  onContentChange: (newContent: string) => void;
  onAiUpdate: () => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  selectedFile,
  files,
  onContentChange,
  onAiUpdate,
}) => {
  return (
    <div className="h-full p-4 space-y-4">
      {selectedFile ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Original File</h2>
            <Button onClick={onAiUpdate}>Update with AI</Button>
          </div>
          <CodePreview
            filename={selectedFile}
            content={files[selectedFile]}
            onContentChange={onContentChange}
          />
        </>
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          Select a file to edit
        </div>
      )}
    </div>
  );
};

export default EditorPanel;