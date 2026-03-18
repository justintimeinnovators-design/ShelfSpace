"use client";

import React from "react";
import { ForumsFeature } from "@/components/forums/ForumsFeature";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ForumsErrorFallback } from "@/components/common/ErrorFallbacks/ForumsErrorFallback";

/**
 * Forums Page.
 */
const ForumsPage: React.FC = () => {
  return (
    <ErrorBoundary fallback={ForumsErrorFallback}>
      <ForumsFeature />
    </ErrorBoundary>
  );
};

export default ForumsPage;
