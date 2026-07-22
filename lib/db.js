import mysql from "mysql2/promise";

let pool;

export async function connectDB() {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: 3306, // أضف المنفذ لو السيرفر MySQL خارجي
        waitForConnections: true,
        connectionLimit: 10, // عدد الاتصالات المسموح بها
        queueLimit: 0,
      });
      console.log("✅ Database pool created successfully");
    }
    return pool;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
}
