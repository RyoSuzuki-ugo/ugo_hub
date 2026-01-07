import { cn } from "../../lib/utils.ts";
import { Bot, User } from "lucide-react";
import { Button } from "./button";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  className?: string;
  showAvatar?: boolean;
  isStreaming?: boolean;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
    className?: string;
  }[];
}

export function ChatMessage({
  role,
  content,
  className,
  showAvatar = true,
  isStreaming = false,
  actions,
}: ChatMessageProps) {
  const isUser = role === "user";
  const isAssistant = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      {showAvatar && isAssistant && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      )}

      <div className={cn("max-w-[70%]", isUser && "order-1")}>
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          <div className="whitespace-pre-wrap">
            {content}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
            )}
          </div>
        </div>
        {actions && actions.length > 0 && (
          <div className="flex gap-3 mt-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || "default"}
                size="lg"
                className={cn("flex-1 font-bold", action.className)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {showAvatar && isUser && (
        <div className="flex-shrink-0 order-2">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-secondary-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
