import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
export default NextAuth({
  providers: [CredentialsProvider({})],
});
