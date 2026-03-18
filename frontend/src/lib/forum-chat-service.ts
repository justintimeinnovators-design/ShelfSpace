// Forum Chat Service (for forum live chat)
// Retrieves message history from the chat-service via the gateway

import api from "./api";
import { getErrorMessage } from "./api-utils";

export class ChatService {
/**
 * Get Messages.
 * @param forumId - forum Id value.
 * @param options - options value.
 * @returns Promise<any[]>.
 */
  static async getMessages(
    forumId: string,
    options: { limit?: number; offset?: number }
  ): Promise<any[]> {
    try {
      const response = await api.get(`/api/chat/groups/${forumId}/messages`, {
        params: {
          ...(options.limit ? { limit: options.limit } : {}),
          ...(options.offset ? { offset: options.offset } : {}),
        },
      });
      return response.data || [];
    } catch (error) {
      const message = getErrorMessage(error) || "Failed to fetch forum chat messages";
      console.error(message, error);
      throw new Error(message);
    }
  }
}
