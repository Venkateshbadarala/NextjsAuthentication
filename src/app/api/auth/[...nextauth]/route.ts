import { NextAuthOptions, User as IUser } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/app/Adaptor/MongoAdaptor";
import dbConnect from "@/app/Database/db.connection/dbconnection";
import User from "@/app/Database/models/user";
import bcrypt from "bcrypt";

interface ICustomUsers extends IUser {
  roles: number[];
  active: boolean;
  is_admin: boolean;
  provider: string;
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          uid: profile.sub,
          roles: [2001],
          is_admin: false,
          provider: "google",
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name || "anonymous",
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const isActive = await User.findOne({ email: user.email });
      if (isActive?.active) {
        
        console.log("Good User");
        return true;
      } else {
        console.log("Bad User");
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account?.access_token;
      }
      if (user) {
        token.id = user.id;

        const userData = user as ICustomUsers;
        let customData;
        if (userData?.provider) {
          const existUser = await User.findOne({ email: user.email });
          if (existUser) {
            customData = {
              id: existUser._id.toString(),
              name: existUser.name,
              email: existUser.email,
              image: existUser.image,
              roles: existUser.roles,
              is_admin: existUser.is_admin,
            };
          }
        } else {
          customData = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            image: userData.image,
            roles: userData.roles,
            is_admin: userData.is_admin,
          };
        }

        return { ...token, ...customData };
      }

      // Fetch the latest user data whenever the JWT token is refreshed
      await dbConnect();
      const currentUser = await User.findOne({ email: token.email });
      if (currentUser) {
        token = {
          ...token,
          id: currentUser._id.toString(),
          name: currentUser.name,
          email: currentUser.email,
          image: currentUser.image,
          roles: currentUser.roles,
          is_admin: currentUser.is_admin,
        };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
