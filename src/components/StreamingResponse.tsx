import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";

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
  const [displayContent, setDisplayContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayContent(prev => prev + content[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        if (!showRaw) {
          onComplete?.(content);
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [content, onComplete, showRaw]);

  useEffect(() => {
    if (isComplete && !showRaw) {
      onComplete?.(content);
    }
  }, [showRaw, isComplete, content, onComplete]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 font-mono flex-grow">
        <div className="mb-2 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Here is the suggested code for {filename}:
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRaw(!showRaw)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showRaw ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {showRaw ? "Hide Raw" : "Show Raw"}
          </Button>
        </div>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto h-full">
          <code className="text-sm whitespace-pre-wrap">
            {showRaw ? content : displayContent}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default StreamingResponse;