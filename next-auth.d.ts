import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      _id: string;
      username: string;
      threads: [];
      onboarded: boolean;
      communities: [];
      token: string;
      name?: string;
      image?: string;
      bio?: string;
    };
  }
  interface User extends DefaultUser {
    _id: string;
    username: string;
    threads: [];
    onboarded: boolean;
    communities: [];
    token: string;
    name?: string;
    image?: string;
    bio?: string;
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
      name?: string;
      image?: string;
      bio?: string;
    };
  }
}
