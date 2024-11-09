import React, { useState } from "react";
import { Check, X, GitCommit, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import CodePreview from "./CodePreview";

interface AiSuggestionPanelProps {
  selectedFile: string | null;
  files: Record<string, string>;
  aiResponses: Record<string, string>;
  isStreaming: boolean;
  onAiResponseChange: (newContent: string) => void;
  onStreamComplete: (code: string) => void;
  onMerge: () => void;
  onSkip: () => void;
  onCommit: () => void;
}

const AiSuggestionPanel: React.FC<AiSuggestionPanelProps> = ({
  selectedFile,
  files,
  aiResponses,
  onAiResponseChange,
  onMerge,
  onSkip,
  onCommit,
}) => {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">AI Suggestions</h2>
        {selectedFile && aiResponses[selectedFile] && (
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowRaw(!showRaw)} 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              {showRaw ? (
                <EyeOff className="h-4 w-4 mr-1" />
              ) : (
                <Eye className="h-4 w-4 mr-1" />
              )}
              {showRaw ? "Hide Raw" : "Show Raw"}
            </Button>
            <Button 
              onClick={onSkip} 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Skip
            </Button>
            <Button 
              onClick={onMerge} 
              variant="outline" 
              size="sm"
              className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button 
              onClick={onCommit} 
              size="sm"
              className="bg-primary/90 hover:bg-primary"
            >
              <GitCommit className="w-4 h-4 mr-1" />
              Commit
            </Button>
          </div>
        )}
      </div>
      <div className="flex-grow overflow-hidden">
        {selectedFile && aiResponses[selectedFile] ? (
          <CodePreview
            filename={selectedFile}
            content={aiResponses[selectedFile]}
            originalContent={files[selectedFile]}
            onContentChange={onAiResponseChange}
            readOnly={!showRaw}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Click "Update with AI" to see suggestions
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSuggestionPanel;