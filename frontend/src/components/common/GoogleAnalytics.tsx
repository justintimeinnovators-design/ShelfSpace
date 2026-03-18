"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

type GoogleAnalyticsProps = {
  measurementId?: string;
};

/**
 * Google Analytics.
 * @param { measurementId } - { measurement Id } value.
 */
export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const gaId = measurementId || process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'];
  if (!gaId) return null;
  return <NextGoogleAnalytics gaId={gaId} />;
}


