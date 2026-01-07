import React, { KeyboardEvent, useState } from "react";
import { cn } from "../../lib/utils.ts";
import { Button } from "./button.tsx";
import { Loader2, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function ChatInput({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  isLoading = false,
  className,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled || isLoading) return;

    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        rows={1}
        className={cn(
          "flex-1 resize-none !px-2 !py-2 rounded-lg border",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "min-h-[40px] max-h-[120px]"
        )}
        style={{
          height: "auto",
          overflow: input.split("\n").length > 3 ? "auto" : "hidden",
        }}
      />

      <Button
        type="submit"
        size="icon"
        disabled={disabled || isLoading || !input.trim()}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
}
