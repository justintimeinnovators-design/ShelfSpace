"use client";

import { useCallback } from "react";
import { Toast } from "@/components/ui/MicroInteractions";
import { createRoot } from "react-dom/client";

interface ToastOptions {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

let toastContainer: HTMLDivElement | null = null;

/**
 * Get Toast Container.
 */
const getToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "fixed top-0 right-0 z-50 p-4 space-y-2";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

/**
 * Use Toast.
 */
export const useToast = () => {
  const showToast = useCallback((options: ToastOptions) => {
    const container = getToastContainer();
    const toastId = `toast-${Date.now()}`;
    const toastElement = document.createElement("div");
    toastElement.id = toastId;
    container.appendChild(toastElement);

    const root = createRoot(toastElement);

/**
 * Handle Close.
 */
    const handleClose = () => {
      root.unmount();
      toastElement.remove();
    };

    root.render(
      <Toast
        message={options.message}
        type={options.type || "info"}
        duration={options.duration || 3000}
        onClose={handleClose}
      />
    );
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "success", duration: duration || 3000 });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "error", duration: duration || 3000 });
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "warning", duration: duration || 3000 });
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "info", duration: duration || 3000 });
    },
    [showToast]
  );

  return {
    showToast,
    success,
    error,
    warning,
    info,
  };
};
