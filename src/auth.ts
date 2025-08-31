import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

type Role = "ADMIN" | "MEMBER" | "GUEST";

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
        const user = demoUsers[email];
        if (!user) return null;
        if (password !== user.password) return null;
        // Return only safe fields
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as Role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as any).role) token.role = (user as any).role as Role;
      return token;
    },
    async session({ session, token }) {
      if (session.user)
        (session.user as any).role = (token.role as Role) ?? "GUEST";
      return session;
    },
  },
});
