import React from "react";
import { Check, X, GitCommit } from "lucide-react";
import { Button } from "./ui/button";
import CodePreview from "./CodePreview";
import StreamingResponse from "./StreamingResponse";
import { toast } from "sonner";

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
  isStreaming,
  onAiResponseChange,
  onStreamComplete,
  onMerge,
  onSkip,
  onCommit,
}) => {
  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Suggestions</h2>
        {selectedFile && aiResponses[selectedFile] && (
          <div className="flex gap-2">
            <Button onClick={onSkip} variant="outline" className="gap-2">
              <X className="w-4 h-4" />
              Skip
            </Button>
            <Button onClick={onMerge} variant="outline" className="gap-2">
              <Check className="w-4 h-4" />
              Approve
            </Button>
            <Button onClick={onCommit} className="gap-2">
              <GitCommit className="w-4 h-4" />
              Commit Changes
            </Button>
          </div>
        )}
      </div>
      {isStreaming ? (
        <StreamingResponse
          content={aiResponses[selectedFile!]}
          onComplete={onStreamComplete}
        />
      ) : selectedFile && aiResponses[selectedFile] ? (
        <CodePreview
          filename="AI Response"
          content={aiResponses[selectedFile]}
          originalContent={files[selectedFile]}
          onContentChange={onAiResponseChange}
        />
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          Click "Update with AI" to see suggestions
        </div>
      )}
    </div>
  );
};

export default AiSuggestionPanel;