import prisma from "@/lib/prisma";
import { compare } from "bcrypt-ts";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

export const { auth, signIn, signOut, handlers } = NextAuth({
  pages: {
    signIn: "/login",
    signOut: "/register",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;

      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        name: {
          type: "text",
          label: "Name",
          placeholder: "John Doe",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ name: z.string().min(3), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;
        const { name, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: {
            name: name,
          },
        });

        if (!user) return null;

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) return null;

        return { ...user, password: undefined };
      },
    }),
  ],
});
