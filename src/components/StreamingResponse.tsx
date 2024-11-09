import React from "react";
import { cn } from "@/lib/utils";
import CodePreview from "./CodePreview";

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
  // Simplified to just show the code directly
  React.useEffect(() => {
    if (content && onComplete) {
      onComplete(content);
    }
  }, [content, onComplete]);

  return (
    <div className="p-4">
      <CodePreview
        filename={filename}
        content={content}
        readOnly
      />
    </div>
  );
};

export default StreamingResponse;