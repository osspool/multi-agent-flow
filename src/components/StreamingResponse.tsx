import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayContent(prev => prev + content[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        if (onComplete) {
          onComplete(content);
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [content, onComplete]);

  return (
    <div className="p-4 font-mono">
      <div className="mb-2 text-sm text-muted-foreground">
        Here is the suggested code for {filename}:
      </div>
      <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
        <code className="text-sm">
          {displayContent}
        </code>
      </pre>
    </div>
  );
};

export default StreamingResponse;