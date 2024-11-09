import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface StreamingResponseProps {
  content: string;
  onComplete?: (code: string) => void;
}

const StreamingResponse: React.FC<StreamingResponseProps> = ({
  content = "", // Provide default empty string
  onComplete,
}) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!content) {
      return; // Early return if content is undefined or empty
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent((prev) => prev + content[index]);
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
        // Extract code block and send it to parent
        const codeMatch = content.match(/```(?:js|typescript)?\n([\s\S]*?)```/);
        if (codeMatch && onComplete) {
          onComplete(codeMatch[1]);
        }
      }
    }, 20); // Adjust speed as needed

    return () => clearInterval(interval);
  }, [content, onComplete]);

  return (
    <div
      className={cn(
        "font-mono text-sm p-4 bg-background/50 rounded-lg border transition-opacity duration-200",
        !isComplete && "animate-pulse"
      )}
    >
      <pre className="whitespace-pre-wrap">{displayedContent}</pre>
    </div>
  );
};

export default StreamingResponse;