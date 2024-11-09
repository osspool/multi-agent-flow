import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FileCode, MessageSquare, Merge } from "lucide-react";
import CodePreview from "@/components/CodePreview";
import StreamingResponse from "@/components/StreamingResponse";
import { mergeCode } from "@/utils/mergeUtils";
import { toast } from "sonner";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
  const [isStreaming, setIsStreaming] = useState(false);
  const [files, setFiles] = useState({
    "src/App.tsx": `import React from 'react';
export default function App() {
  return <div>Hello World</div>;
}`,
    "src/utils.ts": `export function add(a: number, b: number) {
  return a + b;
}`
  });

  const mockAiResponse = `Your code:
\`\`\`js
// AI suggested changes for ${selectedFile}
import React from 'react';
export default function App() {
  return (
    <div className="p-4">
      <h1>Enhanced Hello World</h1>
    </div>
  );
}
\`\`\``;

  const handleFileSelect = (filename: string) => {
    setSelectedFile(filename);
    setIsStreaming(false);
  };

  const handleAiUpdate = () => {
    if (selectedFile) {
      setIsStreaming(true);
      setAiResponses(prev => ({ ...prev, [selectedFile]: '' }));
    }
  };

  const handleStreamComplete = (code: string) => {
    setIsStreaming(false);
    if (selectedFile) {
      setAiResponses(prev => ({ ...prev, [selectedFile]: code }));
    }
  };

  const handleMerge = () => {
    if (selectedFile && aiResponses[selectedFile]) {
      try {
        const fileExtension = selectedFile.split('.').pop() || '';
        const originalCode = files[selectedFile as keyof typeof files];
        const mergedContent = mergeCode(originalCode, aiResponses[selectedFile], fileExtension);
        
        // Update the file content
        setFiles(prev => ({
          ...prev,
          [selectedFile]: mergedContent
        }));
        toast.success("Changes merged successfully!");
      } catch (error) {
        console.error("Error merging changes:", error);
        toast.error("Failed to merge changes. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        {/* File Selection Panel */}
        <ResizablePanel defaultSize={20}>
          <div className="h-full border-r p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Files</h2>
            {Object.entries(files).map(([filename]) => (
              <div
                key={filename}
                className={`p-2 rounded cursor-pointer flex items-center gap-2 ${
                  selectedFile === filename
                    ? "bg-accent"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => handleFileSelect(filename)}
              >
                <FileCode className="w-4 h-4" />
                <span className="text-sm">{filename}</span>
              </div>
            ))}
          </div>
        </ResizablePanel>

        {/* Code Editor Panel */}
        <ResizablePanel defaultSize={40}>
          <div className="h-full p-4 space-y-4">
            {selectedFile ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Original File</h2>
                  <Button onClick={handleAiUpdate}>
                    Update with AI
                  </Button>
                </div>
                <CodePreview
                  filename={selectedFile}
                  content={files[selectedFile as keyof typeof files]}
                />
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a file to edit
              </div>
            )}
          </div>
        </ResizablePanel>

        {/* AI Response Panel */}
        <ResizablePanel defaultSize={40}>
          <div className="h-full p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">AI Suggestions</h2>
              {selectedFile && aiResponses[selectedFile] && (
                <Button onClick={handleMerge} className="gap-2">
                  <Merge className="w-4 h-4" />
                  Merge Changes
                </Button>
              )}
            </div>
            {isStreaming ? (
              <StreamingResponse 
                content={mockAiResponse} 
                onComplete={handleStreamComplete}
              />
            ) : selectedFile && aiResponses[selectedFile] ? (
              <CodePreview
                filename="AI Response"
                content={aiResponses[selectedFile]}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Click "Update with AI" to see suggestions
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Chat Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 rounded-full h-12 w-12"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <div className="h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Chat with AI</h2>
            <div className="flex-grow bg-accent/20 rounded-lg p-4">
              <div className="text-muted-foreground text-center">
                No messages yet
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;