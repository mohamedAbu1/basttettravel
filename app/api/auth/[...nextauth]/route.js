import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs"; // ✅ مكتبة التشفير

const pool = await connectDB();

export const authOptions = {
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

      // ✅ لو مفيش باسورد، نحط باسورد افتراضي مشفر
      let password = rows.length > 0 ? rows[0].password : null;
      if (!password) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash("Mohamed19971126", salt);
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
