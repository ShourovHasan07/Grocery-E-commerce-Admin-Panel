import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const res = await fetch(
            "http://localhost:4000/auth/admin/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok || !data.token) return null;

          // ✅ MUST return object
          return {
            id: data.user.id.toString(),
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || "SUPER_ADMIN",
            permissions: data.user.permissions,
            accessToken: data.token,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.permissions = user.permissions;
        token.userId = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;
      session.permissions = token.permissions;
      session.userId = token.userId;
      session.accessToken = token.accessToken;
      return session;
    },

    //  LOGIN SUCCESS REDIRECT
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
