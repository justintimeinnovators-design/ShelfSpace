import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
    } & DefaultSession["user"];
    token?: string;
  }

  interface JWT {
    token?: string;
  }
}
