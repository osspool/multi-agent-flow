import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FileCode, MessageSquare, Merge } from "lucide-react";
import CodePreview from "@/components/CodePreview";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Sample files (in real app, these would come from the first AI)
  const sampleFiles = {
    "src/App.tsx": `import React from 'react';
export default function App() {
  return <div>Hello World</div>;
}`,
    "src/utils.ts": `export function add(a: number, b: number) {
  return a + b;
}`
  };

  const handleAiUpdate = () => {
    if (selectedFile) {
      // Simulate AI response
      setAiResponse(`// AI suggested changes for ${selectedFile}
import React from 'react';
export default function App() {
  return (
    <div className="p-4">
      <h1>Enhanced Hello World</h1>
    </div>
  );
}`);
    }
  };

  const handleMerge = () => {
    if (selectedFile && aiResponse) {
      // In a real app, you'd want to handle merging more carefully
      const mergedContent = aiResponse;
      console.log("Merged content:", mergedContent);
    }
  };

  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        {/* File Selection Panel */}
        <ResizablePanel defaultSize={20}>
          <div className="h-full border-r p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Files</h2>
            {Object.entries(sampleFiles).map(([filename]) => (
              <div
                key={filename}
                className={`p-2 rounded cursor-pointer flex items-center gap-2 ${
                  selectedFile === filename
                    ? "bg-accent"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => setSelectedFile(filename)}
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
                  content={sampleFiles[selectedFile as keyof typeof sampleFiles]}
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
              {aiResponse && (
                <Button onClick={handleMerge} className="gap-2">
                  <Merge className="w-4 h-4" />
                  Merge Changes
                </Button>
              )}
            </div>
            {aiResponse ? (
              <CodePreview
                filename="AI Response"
                content={aiResponse}
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
              {/* Chat messages would go here */}
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