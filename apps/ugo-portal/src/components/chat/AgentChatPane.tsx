"use client";

import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import Chat, { type ChatMessageType, type ChatRef } from "./Chat";
import {
  agentChatService,
  type AgentPostMessageResponse,
} from "@next-monorepo/api-client";
import { useTeleope } from "../../contexts/TeleopeContext";

export interface AgentChatPaneRef {
  postSystemMessage: (
    message: string,
    actions?: {
      label: string;
      onClick: () => void;
      variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
      className?: string;
    }[]
  ) => string; // メッセージIDを返す
  updateMessage: (
    messageId: string,
    updates: {
      content?: string;
      actions?: {
        label: string;
        onClick: () => void;
        variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
        className?: string;
      }[];
    }
  ) => void;
}

const AgentChatPane = forwardRef<AgentChatPaneRef, Record<string, unknown>>(
  function AgentChatPane(_props, ref) {
    const { robot, building, floor } = useTeleope();
    const [conversationId, setConversationId] = useState<string | undefined>();
    const chatRef = useRef<ChatRef>(null);

    // 外部からシステムメッセージを投稿できるようにする
    useImperativeHandle(ref, () => ({
      postSystemMessage: (
        message: string,
        actions?: {
          label: string;
          onClick: () => void;
          variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
          className?: string;
        }[]
      ) => {
        return chatRef.current?.addSystemMessage(message, actions) || "";
      },
      updateMessage: (
        messageId: string,
        updates: {
          content?: string;
          actions?: {
            label: string;
            onClick: () => void;
            variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
            className?: string;
          }[];
        }
      ) => {
        chatRef.current?.updateMessage(messageId, updates);
      },
    }));

    const buildLocationPayload = () => {
      if (!building?.id && !floor?.id) return undefined;
      return {
        buildingId: building?.id?.toString(),
        floorId: floor?.id?.toString(),
      };
    };

    const handleSend = async (
      text: string
    ): Promise<ChatMessageType | void> => {
      const response: AgentPostMessageResponse =
        await agentChatService.postMessage({
          text,
          conversationId,
          robotId: robot?.id?.toString(),
          location: buildLocationPayload(),
        });

      setConversationId(response.conversationId);

      const reply =
        response.replyText ??
        "応答を受信しました。（replyTextが空のためプレースホルダーを表示しています）";

      return {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: reply,
      };
    };

    return <Chat ref={chatRef} title="チャット" onSendMessage={handleSend} />;
  }
);

export default AgentChatPane;
