"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn-ui/card";
import { ChatContainer } from "../shadcn-ui/chat-container";
import { ChatMessage } from "../shadcn-ui/chat-message";
import { ChatInput } from "../shadcn-ui/chat-input";

export interface ChatMessageType {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
    className?: string;
  }[];
}

export interface ChatRef {
  addSystemMessage: (content: string, actions?: ChatMessageType["actions"]) => string; // メッセージIDを返す
  updateMessage: (messageId: string, updates: Partial<ChatMessageType>) => void;
}

interface ChatProps {
  readonly title?: string;
  readonly initialMessages?: readonly ChatMessageType[];
  readonly onSendMessage?: (
    message: string
  ) => Promise<ChatMessageType | ChatMessageType[] | void>;
  readonly className?: string;
}

const Chat = forwardRef<ChatRef, ChatProps>(function Chat(
  {
    title = "チャット",
    initialMessages = [
      {
        id: "1",
        role: "assistant",
        content: "こんにちは！何かお手伝いできることはありますか？",
      },
    ],
    onSendMessage,
    className,
  },
  ref
) {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    ...initialMessages,
  ]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // 外部からシステムメッセージを追加できるようにする（ロボットの発言として表示）
  useImperativeHandle(ref, () => ({
    addSystemMessage: (content: string, actions?: ChatMessageType["actions"]) => {
      const messageId = `${Date.now()}-system`;
      const systemMessage: ChatMessageType = {
        id: messageId,
        role: "assistant", // ロボットの発言として表示
        content,
        actions,
      };
      setMessages((prev) => [...prev, systemMessage]);
      return messageId;
    },
    updateMessage: (messageId: string, updates: Partial<ChatMessageType>) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))
      );
    },
  }));

  const handleSendMessage = async (message: string) => {
    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoadingChat(true);

    try {
      if (onSendMessage) {
        const result = await onSendMessage(message);
        if (result) {
          const responses = Array.isArray(result) ? result : [result];
          setMessages((prev) => [...prev, ...responses]);
        }
      } else {
        // デフォルトのモック実装
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `「${message}」について、お手伝いできます。`,
        };
        setMessages((prev) => [...prev, response]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "申し訳ございません。エラーが発生しました。",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  return (
    <Card className={`h-full overflow-hidden flex flex-col ${className ?? ""}`}>
      <CardHeader className="flex-shrink-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
        <ChatContainer className="flex-1">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              actions={msg.actions}
              isStreaming={
                isLoadingChat && msg.id === messages[messages.length - 1]?.id
              }
            />
          ))}
        </ChatContainer>
        <div className="flex-shrink-0 p-4 border-t">
          <ChatInput
            onSend={handleSendMessage}
            placeholder="メッセージを入力..."
            isLoading={isLoadingChat}
          />
        </div>
      </CardContent>
    </Card>
  );
});

export default Chat;
