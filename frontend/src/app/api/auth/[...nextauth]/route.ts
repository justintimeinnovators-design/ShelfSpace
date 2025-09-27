import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { userService } from "@/lib/user-service";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env['GOOGLE_CLIENT_ID']!,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT Callback:", { token, user, account });
      
      if (account && user) {
        try {
          // Create or get user from user service
          const userData = await userService.createUser({
            email: user.email!,
            name: user.name || user.email!.split('@')[0] || 'User',
          });
          
          token['accessToken'] = userData.token;
          token['token'] = userData.token;
          token['userId'] = userData.user.id;
          token['isNewUser'] = userData.isNewUser;
          token['needsPreferences'] = userData.needsPreferences;
          token['user'] = userData.user;
        } catch (error) {
          console.error("Error creating/finding user:", error);
          // Fallback: try to get user by ID if creation fails
          try {
            const userData = await userService.getUserById(user.id);
            token['accessToken'] = userData.token;
            token['token'] = userData.token;
            token['userId'] = user.id;
            token['isNewUser'] = false;
            token['needsPreferences'] = true; // Assume needs preferences if we can't determine
          } catch (getError) {
            console.error("Error getting user token:", getError);
          }
        }
      }
      
      if (user) {
        token['id'] = user.id;
        token['email'] = user.email || null;
      }
      
      return token;
    },

    async session({ session, token }) {
      // console.log("Session Callback:", { session, token });
      session.accessToken = token['token'] as string;
      session.user.id = token['userId'] as string;
      session.user.email = token['email'] as string;
      session.isNewUser = token['isNewUser'] as boolean;
      session.needsPreferences = token['needsPreferences'] as boolean;
      session.userData = token['user'] as any;
      return session;
    },

    async redirect({ url, baseUrl }) {
      // console.log("Redirect Callback:", { url, baseUrl });
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };