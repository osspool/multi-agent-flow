import React from "react";
import { Brain, Code, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentPanelProps {
  type: "context" | "code" | "chat";
  title: string;
  description: string;
  status: "idle" | "working" | "done";
  position: number;
}

const AgentPanel: React.FC<AgentPanelProps> = ({
  type,
  title,
  description,
  status,
  position,
}) => {
  const icons = {
    context: Brain,
    code: Code,
    chat: MessageSquare,
  };

  const Icon = icons[type];
  const agentColor = `agent-${position}`;

  return (
    <div
      className={cn(
        "agent-card rounded-lg p-6 shadow-lg relative",
        "transform transition-all duration-300 hover:scale-105"
      )}
    >
      <div className="absolute -top-3 -left-3 p-2 rounded-full bg-[var(--agent-color)]"
        style={{ "--agent-color": `var(--tw-colors-${agentColor})` } as any}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              status === "idle" && "bg-gray-400",
              status === "working" && "bg-yellow-400 animate-pulse-soft",
              status === "done" && "bg-green-400"
            )}
          />
          <span className="text-xs text-gray-500 capitalize">{status}</span>
        </div>
      </div>
    </div>
  );
};

export default AgentPanel;