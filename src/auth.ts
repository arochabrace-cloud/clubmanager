import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession, User as NextAuthUser } from "next-auth";
import type { JWT } from "next-auth/jwt";

type Role = "ADMIN" | "MEMBER" | "GUEST";

type AppUser = NextAuthUser & { role: Role };
type TokenWithRole = JWT & { role?: Role };
type SessionWithRole = DefaultSession & {
  user?: DefaultSession["user"] & { role?: Role };
};

const demoUsers: Record<
  string,
  { id: string; name: string; email: string; role: Role; password: string }
> = {
  "admin@example.com": {
    id: "1",
    name: "Admin",
    email: "admin@example.com",
    role: "ADMIN",
    password: "admin123",
  },
  "member@example.com": {
    id: "2",
    name: "Member",
    email: "member@example.com",
    role: "MEMBER",
    password: "member123",
  },
  "guest@example.com": {
    id: "3",
    name: "Guest",
    email: "guest@example.com",
    role: "GUEST",
    password: "guest123",
  },
};

export const { auth, signIn, signOut, handlers } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = creds?.email?.toString().toLowerCase() ?? "";
        const password = creds?.password?.toString() ?? "";
        const u = demoUsers[email];
        if (!u || u.password !== password) return null;

        // Extra field 'role' is fine; it's carried via jwt callback below
        const user: AppUser = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
        };
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as TokenWithRole;
      if (user) {
        // `user` may or may not have role depending on provider
        const maybe = user as Partial<AppUser>;
        if (maybe.role) t.role = maybe.role;
      }
      return t;
    },
    async session({ session, token }) {
      const s = session as SessionWithRole;
      const t = token as TokenWithRole;
      if (s.user) s.user.role = t.role ?? s.user.role ?? "GUEST";
      return s;
    },
  },
});
