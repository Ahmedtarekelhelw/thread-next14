import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      username: string;
      threads: [];
      onboarded: boolean;
      communities: [];
      token: string;
    } & DefaultSession;
  }
  interface User extends DefaultUser {
    _id: string;
    username: string;
    threads: [];
    onboarded: boolean;
    communities: [];
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: {
      _id: string;
      username: string;
      threads: [];
      onboarded: boolean;
      communities: [];
      token: string;
    };
  }
}
