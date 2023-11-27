import axios from "axios";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials, req) {
        try {
          const user = await axios.post(`http://localhost:3000/api/login`, {
            username: credentials?.username,
            password: credentials?.password,
          });

          return user.data;
        } catch (error: any) {
          throw new Error(error.response?.data?.msg || "Something went wrong");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      return { ...token, ...user };
    },
    async session({ session, user: u, token: t }) {
      const { user, token } = t;
      session.user = { ...user, token };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
