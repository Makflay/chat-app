import { useEffect, useRef } from "react";
import { useChatStore } from "../../../store/chat-store";

export const useInitChats = () => {
  const connect = useChatStore((store) => store.connect);
  const disconnect = useChatStore((store) => store.disconnect);
  const requestChats = useChatStore((store) => store.requestChats);
  const joinAllChats = useChatStore((store) => store.joinAllChats);
  const openChat = useChatStore((store) => store.openChat);

  const chats = useChatStore((store) => store.chats);
  const isConnected = useChatStore((store) => store.isConnected);
  const activeChatId = useChatStore((store) => store.activeChatId);

  const hasRequestedChatsRef = useRef(false);
  const hasJoinedChatsRef = useRef(false);
  const hasOpenedDefaultChatRef = useRef(false);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
      hasRequestedChatsRef.current = false;
      hasJoinedChatsRef.current = false;
      hasOpenedDefaultChatRef.current = false;
    };
  }, [connect, disconnect]);

  useEffect(() => {
    if (!isConnected || hasRequestedChatsRef.current) return;

    requestChats();
    hasRequestedChatsRef.current = true;
  }, [isConnected, requestChats]);

  useEffect(() => {
    if (!chats.length || hasJoinedChatsRef.current) return;

    joinAllChats();
    hasJoinedChatsRef.current = true;
  }, [chats, joinAllChats]);

  useEffect(() => {
    if (!chats.length || hasOpenedDefaultChatRef.current) return;
    if (activeChatId) {
      hasOpenedDefaultChatRef.current = true;
      return;
    }

    const assistantChat = chats.find((chat) => chat.type === "ASSISTANT");
    const groupChat = chats.find((chat) => chat.type === "GROUP");
    const defaultChatId = assistantChat?.id ?? groupChat?.id ?? chats[0]?.id;

    if (!defaultChatId) return;

    openChat(defaultChatId);
    hasOpenedDefaultChatRef.current = true;
  }, [chats, activeChatId, openChat]);
};
