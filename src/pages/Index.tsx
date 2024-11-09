import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mergeCode } from "@/utils/mergeUtils";
import FileExplorer from "@/components/FileExplorer";
import EditorPanel from "@/components/EditorPanel";
import AiSuggestionPanel from "@/components/AiSuggestionPanel";
import ChatInterface from "@/components/ChatInterface";

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
}`,
    "config.yml": `version: 1.0
settings:
  debug: true
  port: 3000`,
    "data.json": `{
  "name": "Project",
  "version": "1.0.0"
}`
  });

  const handleFileSelect = (filename: string) => {
    setSelectedFile(filename);
    setIsStreaming(false);
  };

  const handleFileContentChange = (newContent: string) => {
    if (selectedFile) {
      setFiles(prev => ({
        ...prev,
        [selectedFile]: newContent
      }));
    }
  };

  const handleAiUpdate = () => {
    if (selectedFile) {
      setIsStreaming(true);
      // Mock AI response for demonstration
      const mockResponse = `Here's an improved version:
\`\`\`${selectedFile.split('.').pop()}
// AI suggested changes for ${selectedFile}
${files[selectedFile].replace('Hello World', 'Enhanced Hello World')}
\`\`\``;
      setAiResponses(prev => ({ ...prev, [selectedFile]: mockResponse }));
    }
  };

  const handleAiResponseChange = (newContent: string) => {
    if (selectedFile) {
      setAiResponses(prev => ({
        ...prev,
        [selectedFile]: newContent
      }));
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
        const mergedContent = mergeCode(
          files[selectedFile],
          aiResponses[selectedFile],
          selectedFile
        );
        
        setFiles(prev => ({
          ...prev,
          [selectedFile]: mergedContent
        }));

        // Clear AI response after successful merge
        setAiResponses(prev => {
          const newResponses = { ...prev };
          delete newResponses[selectedFile];
          return newResponses;
        });

        toast.success("Changes approved and merged!");
      } catch (error) {
        console.error("Error merging changes:", error);
        toast.error("Failed to merge changes. Please try again.");
      }
    }
  };

  const handleSkip = () => {
    if (selectedFile) {
      setAiResponses(prev => {
        const newResponses = { ...prev };
        delete newResponses[selectedFile];
        return newResponses;
      });
      toast.info("Changes skipped");
    }
  };

  const handleCommit = () => {
    toast.success("Changes committed successfully! (Mock)");
  };

  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={15} minSize={15}>
          <FileExplorer
            files={files}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
          />
        </ResizablePanel>

        <ResizablePanel defaultSize={45} minSize={30}>
          <EditorPanel
            selectedFile={selectedFile}
            files={files}
            onContentChange={handleFileContentChange}
            onAiUpdate={handleAiUpdate}
          />
        </ResizablePanel>

        <ResizablePanel defaultSize={40} minSize={30}>
          <AiSuggestionPanel
            selectedFile={selectedFile}
            files={files}
            aiResponses={aiResponses}
            isStreaming={isStreaming}
            onAiResponseChange={handleAiResponseChange}
            onStreamComplete={handleStreamComplete}
            onMerge={handleMerge}
            onSkip={handleSkip}
            onCommit={handleCommit}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <ChatInterface />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;