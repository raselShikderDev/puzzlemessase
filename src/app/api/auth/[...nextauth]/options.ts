import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/userModel";

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      async authorize(credentials, req):Promise<any> {
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
  
  async jwt({ token, user }) {
    if(user){
      token._id = user._id?.toString()
      token.username = user.username
      token.isAcceptingMessage = user.isAcceptingMessage
      token.isVerified = user.isVerified
    }
    
    return token
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async session({ session, token }:any) {
    if(token){
      session.user._id = token._id
      session.user.username = token.username
      session.user.isAcceptingMessage = token.isAcceptingMessage
      session.user.isVerified = token.isVerified
    }
    return session
  },
},

session:{
  strategy: "jwt",
},
secret: process.env.NEXTAUTH_SECRET,
pages:{
      signIn: '/signin',
    },

 };
