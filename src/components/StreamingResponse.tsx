import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getFileType, extractCodeFromMarkdown, extractAiMessage } from "@/utils/fileTypeUtils";

interface StreamingResponseProps {
  content: string;
  filename: string;
  onComplete?: (code: string) => void;
}

const StreamingResponse: React.FC<StreamingResponseProps> = ({
  content = "",
  filename,
  onComplete,
}) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!content) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent((prev) => prev + content[index]);
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
        
        if (onComplete) {
          const fileType = getFileType(filename);
          const extractedCode = extractCodeFromMarkdown(content, fileType);
          onComplete(extractedCode);
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [content, filename, onComplete]);

  const aiMessage = extractAiMessage(displayedContent);
  const codeContent = extractCodeFromMarkdown(displayedContent, getFileType(filename));

  return (
    <div className="space-y-4 p-4">
      {aiMessage && (
        <div className="prose dark:prose-invert max-w-none rounded-lg bg-muted/50 p-4">
          {aiMessage}
        </div>
      )}
      {codeContent && (
        <div
          className={cn(
            "font-mono text-sm p-4 bg-background/50 rounded-lg border transition-opacity duration-200",
            !isComplete && "animate-pulse"
          )}
        >
          <pre className="whitespace-pre-wrap overflow-auto">{codeContent}</pre>
        </div>
      )}
    </div>
  );
};

export default StreamingResponse;