/**
 * Shared HTTP client factory for frontend service modules.
 *
 * Guarantees:
 * - Auth token injection via NextAuth session lookup.
 * - Centralized unauthorized handling (forced sign-out on `401`).
 * - Consistent user-facing error enrichment (`userMessage`).
 */
import axios, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";
import { getErrorMessage } from "./api-utils";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

/**
 * Creates a preconfigured Axios client with auth/error interceptors.
 *
 * @param baseURL Optional override for service-specific base URLs.
 * @returns Axios instance configured for ShelfSpace API usage.
 */
function buildApiClient(baseURL?: string) {
  // Centralized client ensures every service call gets identical auth/error behavior.
  const client = axios.create({
    baseURL:
      (baseURL ?? process.env["NEXT_PUBLIC_API_URL"]) || "http://localhost:3000",
    timeout: 30000, // 30 second timeout
  });

  client.interceptors.request.use(
    async (config) => {
      try {
        // Pull token lazily so we always use the latest refreshed session token.
        const session = await getSession();
        if (session?.accessToken) {
          config.headers["Authorization"] = `Bearer ${session.accessToken}`;
        }
      } catch (error) {
        // Session not available, continue without auth
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (
        typeof window !== "undefined" &&
        error.response?.status === 401
      ) {
        signOut({ callbackUrl: "/login?error=token_expired" });
      }
      // Wrap with user-facing message so UI layers can display consistent errors.
      const enhancedError = {
        ...error,
        userMessage: getErrorMessage(error),
      };
      return Promise.reject(enhancedError);
    }
  );

  return client;
}

export const createApiClient = buildApiClient;

// Default app-wide client used for primary API traffic.
const apiClient = buildApiClient();

export default apiClient;
