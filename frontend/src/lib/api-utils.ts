import axios, { AxiosError } from "axios";

/**
 * Get Error Message.
 * @param error - error value.
 * @returns string.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.status === 401) {
      return "You are not authorized. Please log in again.";
    }
    if (axiosError.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }
    if (axiosError.response?.status === 404) {
      return "The requested resource was not found.";
    }
    if (axiosError.response?.status === 429) {
      return "Too many requests. Please try again later.";
    }
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      return "Server error. Please try again later.";
    }
    if (axiosError.code === "NETWORK_ERROR" || axiosError.message.includes("Network Error")) {
      return "Network error. Please check your connection.";
    }
    return axiosError.message || "An unexpected error occurred.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred.";
}
