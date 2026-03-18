import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface ChatActions {
  sendMessage: () => Promise<void>;
  createNewSession: (title: string) => Promise<unknown>;
  deleteSession: (sessionId: string) => Promise<void>;
  togglePin: (sessionId: string) => Promise<void>;
  renameSession: (sessionId: string, title: string) => Promise<void>;
}

/**
 * UI state/controller hook for `ChatFeatureWithSessions`.
 *
 * Keeps component rendering mostly presentational by extracting local UI state
 * and interaction handlers that sit on top of `useChatSessions` actions.
 */
export function useChatFeatureWithSessionsUI({
  inputMessage,
  actions,
}: {
  inputMessage: string;
  actions: ChatActions;
}) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      await actions.sendMessage();
    }
  };

  const handleNewChat = async () => {
    await actions.createNewSession("New Chat");
    setIsHistoryOpen(false);
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this chat? This action cannot be undone.")) {
      await actions.deleteSession(sessionId);
    }
  };

  const handleTogglePin = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await actions.togglePin(sessionId);
  };

  const startEditingTitle = (
    sessionId: string,
    currentTitle: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setEditingSessionId(sessionId);
    setEditTitle(currentTitle);
  };

  const saveTitle = async (sessionId: string) => {
    if (editTitle.trim()) {
      await actions.renameSession(sessionId, editTitle.trim());
    }
    setEditingSessionId(null);
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return {
    isHistoryOpen,
    setIsHistoryOpen,
    editingSessionId,
    setEditingSessionId,
    editTitle,
    setEditTitle,
    handleSendMessage,
    handleNewChat,
    handleDeleteSession,
    handleTogglePin,
    startEditingTitle,
    saveTitle,
    formatTimestamp,
  };
}
