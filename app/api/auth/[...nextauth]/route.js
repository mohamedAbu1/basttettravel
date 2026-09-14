import NextAuthModule from "next-auth";
import GoogleProviderModule from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs"; // ✅ مكتبة التشفير

// next-auth/providers are CommonJS modules. Normalize both ESM and CJS
// shapes so the App Router build can invoke them correctly on all hosts.
const NextAuth = NextAuthModule.default ?? NextAuthModule;
const GoogleProvider = GoogleProviderModule.default ?? GoogleProviderModule;

const pool = await connectDB();

export const authOptions = {
  // Keep the signing key stable across instances/redeploys. NEXTAUTH_SECRET
  // is preferred, while JWT_SECRET keeps existing deployments compatible.
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const adminEmails = [
        "ismailharoun225@gmail.com",
        "mohamedahmed33m11@gmail.com",
      ];

      const [rows] = await pool.query("SELECT id, password FROM users WHERE email = ?", [user.email]);
      const userId = rows.length > 0 ? rows[0].id : uuidv4();

      const role = adminEmails.includes(user.email) ? "ADMIN" : "USER";

      // OAuth users must not receive a shared/default local password.
      let password = rows.length > 0 ? rows[0].password : null;
      if (!password) {
        password = await bcrypt.hash(uuidv4(), 10);
      }

      await pool.query(
        `INSERT INTO users (id, email, name, avatar_url, gender, role, password, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           avatar_url = VALUES(avatar_url),
           role = VALUES(role),
           password = VALUES(password)`,
        [
          userId,
          user.email,
          user.name || user.email.split("@")[0],
          user.image || "default.webp",
          "other",
          role,
          password, // ✅ الباسورد المشفر
          new Date(),
        ]
      );

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const [rows] = await pool.query("SELECT role FROM users WHERE email = ?", [user.email]);
        token.role = rows.length > 0 ? rows[0].role : "USER";
      }
      return token;
    },

    async session({ session, token }) {
      const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [session.user.email]);

      if (rows.length > 0) {
        session.user.id = rows[0].id;
      } else {
        session.user.id = token.sub;
      }

      session.user.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
