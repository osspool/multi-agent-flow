import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message submission
    setMessage("");
  };

  return (
    <div className="rounded-lg bg-white shadow-lg p-4">
      <div className="h-[300px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded">
        {/* Chat messages would go here */}
        <div className="text-center text-gray-500 text-sm">
          Start a conversation with the AI agents
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;