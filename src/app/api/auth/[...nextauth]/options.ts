import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import { any } from "zod";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "Credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@gmail.com" },
        password: { label: "Password", type: "password" },
        username: {
          label: "Username",
          type: "text",
          placeholder: "yourUsername",
        },
      },
      async authorize(credentials, req) {
        await dbConnect();
        try {
          const user = await userModel.findOne({
            $or: [
              { email: credentials?.email },
              { username: credentials?.username },
            ],
          });

          if (!user) {
            throw new Error("No user Found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }
          if (!credentials?.password) {
            throw new Error("Password is required");
          }
          const isCorrectPassword = await bcrypt.compare(
            credentials?.password,
            user.password
          );

          if (isCorrectPassword) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  
  callbacks:{
    async session({ session, user, token }) {
        return session
      },
      async jwt({ token, user }) {
        return token
  },
  pages:{
    signIn: 'signin',
  },
  session:{
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET
};
