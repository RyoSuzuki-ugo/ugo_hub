"use client";

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";

interface AgentChatContextType {
  // 外部からメッセージを投稿する関数
  readonly postSystemMessage: (message: string) => void;
}

const AgentChatContext = createContext<AgentChatContextType | undefined>(
  undefined
);

export function AgentChatProvider({ children }: { children: ReactNode }) {
  // システムメッセージ投稿用のコールバック（AgentChatPaneから設定される）
  let messageCallback: ((message: string) => void) | null = null;

  const postSystemMessage = useCallback((message: string) => {
    if (messageCallback) {
      messageCallback(message);
    } else {
      console.warn(
        "[AgentChatContext] postSystemMessage called but no callback registered"
      );
    }
  }, []);

  // AgentChatPaneがコールバックを登録するための関数
  const registerCallback = useCallback((callback: (message: string) => void) => {
    messageCallback = callback;
  }, []);

  return (
    <AgentChatContext.Provider
      value={{
        postSystemMessage,
        // @ts-expect-error - registerCallbackは内部APIとして使用
        registerCallback,
      }}
    >
      {children}
    </AgentChatContext.Provider>
  );
}

export const useAgentChat = () => {
  const context = useContext(AgentChatContext);
  if (!context) {
    throw new Error("useAgentChat must be used within AgentChatProvider");
  }
  return context;
};
