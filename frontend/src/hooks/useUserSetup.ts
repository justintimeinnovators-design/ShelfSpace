"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { userService } from "@/lib/user-service";

export function useUserSetup() {
  const { data: session, status } = useSession();
  const [needsPreferences, setNeedsPreferences] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserSetup = async () => {
      if (status === "loading") return;
      
      if (!session?.user) {
        // Clear user service token when no session
        userService.clearToken();
        setIsLoading(false);
        return;
      }

      try {
        // Set the auth token for user service
        if (session.accessToken) {
          userService.setToken(session.accessToken);
        }

        // Use session data if available, otherwise fetch from API
        if (session.userData) {
          setUser(session.userData);
          setNeedsPreferences(session.needsPreferences || false);
        } else {
          // Fallback: fetch user data from API
          const userData = await userService.getCurrentUser();
          setUser(userData);
          setNeedsPreferences(!userData.preferences);
        }
      } catch (error) {
        console.error("Error checking user setup:", error);
        // Use session data as fallback
        if (session.needsPreferences !== undefined) {
          setNeedsPreferences(session.needsPreferences);
        } else {
          setNeedsPreferences(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSetup();
  }, [session, status]);

  const markPreferencesComplete = () => {
    setNeedsPreferences(false);
  };

  return {
    needsPreferences,
    isLoading,
    user,
    isNewUser: session?.isNewUser || false,
    markPreferencesComplete,
  };
}
