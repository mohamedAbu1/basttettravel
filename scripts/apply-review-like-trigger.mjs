import "dotenv/config";
import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
});

try {
  await db.query("DROP TRIGGER IF EXISTS after_review_like_insert");
  await db.query(`
    CREATE TRIGGER after_review_like_insert
    AFTER INSERT ON review_likes
    FOR EACH ROW
    BEGIN
      INSERT INTO notifications (
        id, admin_id, event_type, message, created_at, is_read,
        user_name, user_email, user_image, trip_id, user_id,
        message_id, type, comment_id
      )
      SELECT
        UUID(),
        admin_user.id,
        'like',
        CONCAT('❤️ ', liked_by.name, ' liked the comment by ', review_author.name,
               ' on trip "', trip.title, '"'),
        NOW(),
        0,
        liked_by.name,
        liked_by.email,
        liked_by.avatar_url,
        NEW.trip_id,
        NEW.user_id,
        UUID(),
        'purchase',
        NEW.review_id
      FROM users AS admin_user
      JOIN users AS liked_by ON liked_by.id = NEW.user_id
      JOIN reviews AS review ON review.id = NEW.review_id
      JOIN users AS review_author ON review_author.id = review.user_id
      JOIN trips AS trip ON trip.id = NEW.trip_id
      WHERE admin_user.role = 'ADMIN';
    END
  `);
  console.log("review like trigger repaired");
} finally {
  await db.end();
}
