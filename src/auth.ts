// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { z } from "zod";

type Role = "ADMIN" | "MEMBER";

const CredsSchema = z.object({
  // allow login by email OR username
  usernameOrEmail: z.string().min(1),
  password: z.string().min(1),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  // IMPORTANT when deploying behind a proxy (Vercel/etc.)
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = CredsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { usernameOrEmail, password } = parsed.data;
        const id = usernameOrEmail.trim();

        // look up by email OR username, select only what we need
        const user = await prisma.user.findFirst({
          where: { OR: [{ email: id }, { username: id }] },
          select: {
            id: true,
            email: true,
            username: true,
            role: true, // Prisma enum UserRole
            memberId: true,
            passwordHash: true, // <- must exist in your Prisma model
          },
        });

        if (!user || !user.passwordHash) return null;

        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;

        // Return minimal payload; additional fields go into JWT in callbacks
        return {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role as Role,
          memberId: user.memberId ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // put role + memberId onto JWT
      if (user) {
        token.role = (user as any).role;
        token.memberId = (user as any).memberId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      // expose role + memberId to the client
      if (token?.sub) (session.user as any).id = token.sub;
      (session.user as any).role = token.role;
      (session.user as any).memberId = token.memberId ?? null;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // optional: your custom login page
  },
});
