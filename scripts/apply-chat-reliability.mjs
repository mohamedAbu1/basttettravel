import "dotenv/config";
import mysql from "mysql2/promise";

const db = await mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, port: Number(process.env.DB_PORT || 3306) });
try {
  const [columns] = await db.query("SHOW COLUMNS FROM messages LIKE 'message_type'");
  if (!columns.length) await db.query("ALTER TABLE messages ADD COLUMN message_type varchar(30) NOT NULL DEFAULT 'chat'");
  await db.query(`CREATE TABLE IF NOT EXISTS conversation_typing (user_id uuid NOT NULL, user_typing tinyint(1) NOT NULL DEFAULT 0, admin_typing tinyint(1) NOT NULL DEFAULT 0, user_updated_at timestamp NULL DEFAULT NULL, admin_updated_at timestamp NULL DEFAULT NULL, updated_at timestamp NOT NULL, PRIMARY KEY (user_id), CONSTRAINT conversation_typing_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  console.log("Chat reliability schema repaired");
} finally { await db.end(); }
