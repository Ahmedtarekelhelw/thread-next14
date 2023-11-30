import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        try {
          const user = await axios.post(`http://localhost:3000/api/login`, {
            username: username,
            password: password,
          });
          // const { image, ...others } = user.data.user;

          return user.data;
        } catch (error: any) {
          throw new Error(error.response?.data?.msg || "Something went wrong");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, user, token }) {
      if (session?.user)
        session.user = {
          ...token.user,
        };
      return session;
    },
  },
};
