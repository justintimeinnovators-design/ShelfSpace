"use client";

import React from "react";
import { ToastProvider } from "@/components/ui/Toast";

/**
 * Client Providers.
 * @param { children } - { children } value.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
