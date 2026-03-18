import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { userService } from "@/lib/user-service";

const USER_SERVICE_TOKEN_MAX_AGE_SECONDS = 6 * 60 * 60;

/**
 * Get Jwt Expiry Ms.
 * @param token - token value.
 * @returns number | null.
 */
function getJwtExpiryMs(token: string): number | null {
  const parts = token.split(".");
  if (parts.length < 2 || !parts[1]) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8")
    ) as { exp?: number };
    if (typeof payload.exp === "number") {
      return payload.exp * 1000;
    }
  } catch (error) {
    console.warn("[AUTH] Failed to decode token expiry:", error);
  }
  return null;
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env['GOOGLE_CLIENT_ID']!,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      httpOptions: {
        timeout: 10000, // 10 second timeout
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: USER_SERVICE_TOKEN_MAX_AGE_SECONDS,
  },
  jwt: {
    maxAge: USER_SERVICE_TOKEN_MAX_AGE_SECONDS,
  },
  callbacks: {
/**
 * Sign In.
 * @param { user, account } - { user, account } value.
 */
    async signIn({ user, account }) {
      console.log("\n\n=== SIGNIN CALLBACK TRIGGERED ===");
      console.log("User email:", user.email);
      console.log("User name:", user.name);
      console.log("Account provider:", account?.provider);
      
      // Only proceed if we have user data
      if (!user.email) {
        console.error("[ERROR] No email provided, blocking sign in");
        return false;
      }

      try {
        console.log("[AUTH] Attempting to create/find user in backend...");
        console.log("[AUTH] Calling userService.createUser with:", {
          email: user.email,
          name: user.name || user.email.split('@')[0] || 'User',
        });
        
        // Try to create or find user in backend
        const userData = await userService.createUser({
          email: user.email,
          name: user.name || user.email.split('@')[0] || 'User',
        });
        
        console.log("[SUCCESS] User successfully created/found in backend!");
        console.log("Backend user ID:", userData.user.id);
        console.log("Is new user:", userData.isNewUser);
        console.log("Has token:", !!userData.token);
        
        // Store the backend user ID in the user object for the JWT callback
        user.id = userData.user.id;
        
        console.log("=== SIGNIN CALLBACK END (Success) ===\n\n");
        return true;
      } catch (error: any) {
        console.error("\n\n[ERROR] === SIGNIN CALLBACK ERROR ===");
        console.error("Failed to create/find user in backend");
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        console.error("Error response:", error.response?.data);
        
        // Allow sign in to complete; middleware/session will handle unverified users
        console.error("[WARNING] Backend user creation failed; allowing sign in to complete");
        console.error("=== SIGNIN CALLBACK END (Unverified) ===\n\n");
        return true;
      }
    },

/**
 * Jwt.
 * @param { token, user, account, trigger, session } - { token, user, account, trigger, session } value.
 */
    async jwt({ token, user, account, trigger, session }) {
      console.log("\n=== JWT CALLBACK START ===");
      console.log("Trigger:", trigger);
      console.log("Has user:", !!user);
      console.log("Has account:", !!account);
      console.log("Token email:", token.email);

      const accessTokenExpires = token["accessTokenExpires"] as number | undefined;
      if (!account && !user && accessTokenExpires && Date.now() >= accessTokenExpires) {
        console.warn("[AUTH] Access token expired; marking session as invalid");
        token["error"] = "TokenExpired";
        token["backendVerified"] = false;
        token["token"] = undefined;
        token["accessToken"] = undefined;
        return token;
      }
      
      // Handle session update from client (e.g., after onboarding)
      if (trigger === "update" && session) {
        console.log("[UPDATE] Session update triggered from client");
        console.log("Update data:", session);
        
        // Update token with new session data
        if (session.isNewUser !== undefined) {
          token['isNewUser'] = session.isNewUser;
          console.log("Updated isNewUser to:", session.isNewUser);
        }
        if (session.needsPreferences !== undefined) {
          token['needsPreferences'] = session.needsPreferences;
          console.log("Updated needsPreferences to:", session.needsPreferences);
        }
        
        return token;
      }
      
      // On initial sign in (when account and user are present)
      if (account && user) {
        try {
          console.log("[AUTH] Initial sign in - fetching user data from backend...");
          
          // Create or get user from user service
          const userData = await userService.createUser({
            email: user.email!,
            name: user.name || user.email!.split('@')[0] || 'User',
          });
          
          console.log("[SUCCESS] User service response received");
          console.log("User ID:", userData.user.id);
          console.log("Is new user:", userData.isNewUser);
          console.log("Needs preferences:", userData.needsPreferences);
          
          // Store all necessary data in the token
          token['accessToken'] = userData.token;
          token['token'] = userData.token;
          token['accessTokenExpires'] = getJwtExpiryMs(userData.token);
          token['userId'] = userData.user.id;
          token['isNewUser'] = userData.isNewUser;
          token['needsPreferences'] = userData.needsPreferences;
          token['user'] = userData.user;
          token['backendVerified'] = true;
          token['error'] = undefined;
          
          console.log("[SUCCESS] Token updated successfully with backend data");
        } catch (error: any) {
          console.error("\n[ERROR] === ERROR in JWT Callback ===");
          console.error("Error creating/finding user:", error.message);
          
          // Mark as not verified
          token['backendVerified'] = false;
          
          // Don't throw error, just mark as unverified
          console.error("[WARNING] Marking as unverified - will retry on next request");
        }
      } else if (token.email && !token['backendVerified']) {
        // Try to verify existing token with backend
        try {
          console.log("[AUTH] Attempting to verify existing user with backend...");
          const userData = await userService.createUser({
            email: token.email as string,
            name: (token.name as string) || (token.email as string).split('@')[0] || 'User',
          });
          
          console.log("[SUCCESS] Existing user verified with backend");
          token['accessToken'] = userData.token;
          token['token'] = userData.token;
          token['accessTokenExpires'] = getJwtExpiryMs(userData.token);
          token['userId'] = userData.user.id;
          token['isNewUser'] = userData.isNewUser;
          token['needsPreferences'] = userData.needsPreferences;
          token['user'] = userData.user;
          token['backendVerified'] = true;
          token['error'] = undefined;
        } catch (error: any) {
          console.error("[WARNING] Could not verify existing user:", error.message);
          token['backendVerified'] = false;
        }
      }
      
      // Always include basic user info
      if (user) {
        token['id'] = user.id;
        token['email'] = user.email || null;
        token['name'] = user.name || null;
      }
      
      console.log("=== JWT CALLBACK END ===");
      console.log("Token has userId:", !!token['userId']);
      console.log("Token backendVerified:", token['backendVerified']);
      console.log("Token isNewUser:", token['isNewUser']);
      console.log("Token needsPreferences:", token['needsPreferences']);
      console.log("\n");
      
      return token;
    },

/**
 * Session.
 * @param { session, token } - { session, token } value.
 */
    async session({ session, token }) {
      console.log("\n=== SESSION CALLBACK START ===");
      console.log("Token userId:", token['userId']);
      console.log("Token backendVerified:", token['backendVerified']);

      const accessTokenExpires = token["accessTokenExpires"] as number | undefined;
      if (token["error"] === "TokenExpired" || (accessTokenExpires && Date.now() >= accessTokenExpires)) {
        console.error("[ERROR] Session created with expired token");
        session.backendVerified = false as boolean;
        delete session.accessToken;
        session.error = "TokenExpired";
        return session;
      }
      
      // Do not throw here; let middleware handle unverified tokens gracefully
      if (!token['backendVerified']) {
        console.error("[ERROR] Session created with unverified backend");
        session.backendVerified = false as boolean;
        return session;
      }
      
      // Populate session with backend data
      session.accessToken = token['token'] as string;
      session.user.id = token['userId'] as string;
      session.user.email = token['email'] as string;
      session.user.name = token['name'] as string;
      session.isNewUser = token['isNewUser'] as boolean;
      session.needsPreferences = token['needsPreferences'] as boolean;
      session.userData = token['user'] as any;
      session.backendVerified = token['backendVerified'] as boolean;
      
      console.log("[SUCCESS] Session created successfully");
      console.log("Session user ID:", session.user.id);
      console.log("=== SESSION CALLBACK END ===\n");
      return session;
    },

/**
 * Redirect.
 * @param { url, baseUrl } - { url, base Url } value.
 */
    async redirect({ url, baseUrl }) {
      console.log("\n=== REDIRECT CALLBACK ===");
      console.log("URL:", url);
      console.log("Base URL:", baseUrl);
      
      // Don't redirect automatically - let the login page handle it
      // This ensures the session is fully populated before redirect
      if (url.startsWith("/")) {
        console.log("Redirecting to:", `${baseUrl}${url}`);
        return `${baseUrl}${url}`;
      }
      else if (new URL(url).origin === baseUrl) {
        console.log("Redirecting to:", url);
        return url;
      }
      
      // After successful sign in, redirect to login page which will handle the proper redirect
      console.log("Redirecting to login page for proper routing");
      return `${baseUrl}/login`;
    },
  },
  pages: {
    signIn: "/sign-up",
    error: "/sign-up",
  },
  events: {
/**
 * Sign In.
 * @param message - message value.
 */
    async signIn(message) {
      console.log("\n[EVENT] === SIGNIN EVENT ===");
      console.log("User signed in:", message.user.email);
    },
/**
 * Sign Out.
 */
    async signOut() {
      console.log("\n[EVENT] === SIGNOUT EVENT ===");
      console.log("User signed out");
    },
  },
  debug: true, // Always enable debug mode
};
