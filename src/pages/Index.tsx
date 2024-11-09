import React, { useState } from "react";
import AgentPanel from "@/components/AgentPanel";
import ChatInterface from "@/components/ChatInterface";
import CodePreview from "@/components/CodePreview";
import FlowLine from "@/components/FlowLine";

const Index = () => {
  const [agents] = useState([
    {
      type: "context" as const,
      title: "Context Generator",
      description: "Analyzes queries and generates context for other agents",
      status: "idle" as const,
    },
    {
      type: "code" as const,
      title: "Code Updater",
      description: "Updates code based on context and requirements",
      status: "idle" as const,
    },
    {
      type: "chat" as const,
      title: "Chat Handler",
      description: "Manages conversation and user interaction",
      status: "idle" as const,
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Multi-Agent AI System
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 relative">
              {agents.map((agent, index) => (
                <AgentPanel
                  key={index}
                  {...agent}
                  position={index + 1}
                />
              ))}
              {/* Flow lines would be added here with proper coordinates */}
            </div>
          </div>
          
          <div className="space-y-8">
            <ChatInterface />
            <CodePreview
              filename="example.tsx"
              content={`// Example code preview
const greeting = "Hello, World!";
console.log(greeting);`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;