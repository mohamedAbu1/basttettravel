-- Normalize notification storage before recreating the notification triggers.
ALTER TABLE notifications
  MODIFY admin_id uuid NULL,
  MODIFY trip_id uuid NULL,
  MODIFY message_id uuid NULL,
  MODIFY type enum('purchase','cancel','rebook','booking','message','review','like','signup') NULL DEFAULT 'purchase';

DROP TRIGGER IF EXISTS booking_notification;
DROP TRIGGER IF EXISTS after_message_insert;
DROP TRIGGER IF EXISTS notify_booking_insert;
DROP TRIGGER IF EXISTS after_purchase_update;
DROP TRIGGER IF EXISTS after_review_like_insert;
DROP TRIGGER IF EXISTS after_review_insert;
DROP TRIGGER IF EXISTS after_user_insert;

DELIMITER $$

CREATE TRIGGER after_message_insert
AFTER INSERT ON messages
FOR EACH ROW
BEGIN
  IF NEW.sender_type = 'user' THEN
    INSERT INTO notifications (
      id, admin_id, event_type, message, user_id, user_name, user_email,
      user_image, trip_id, message_id, type, created_at, is_read
    )
    SELECT UUID(), admin_user.id, 'message',
      CONCAT('User ', NEW.user_name, ' sent a new message'),
      NEW.user_id, NEW.user_name, sender.email, NEW.user_image,
      NULL, NEW.id, 'message', NOW(), 0
    FROM users AS admin_user
    JOIN users AS sender ON sender.id = NEW.user_id
    WHERE admin_user.role = 'ADMIN';
  END IF;
END$$

CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO notifications (
    id, admin_id, event_type, message, user_id, user_name, user_email,
    user_image, trip_id, message_id, type, created_at, is_read
  )
  SELECT UUID(), admin_user.id, 'signup',
    CONCAT('New user registered: ', NEW.name, ' (', NEW.email, ')'),
    NEW.id, NEW.name, NEW.email, NEW.avatar_url,
    NULL, UUID(), 'signup', NOW(), 0
  FROM users AS admin_user
  WHERE admin_user.role = 'ADMIN' AND admin_user.id <> NEW.id;
END$$

CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
  INSERT INTO notifications (
    id, admin_id, event_type, message, user_id, user_name, user_email,
    user_image, trip_id, message_id, type, comment_id, created_at, is_read
  )
  SELECT UUID(), admin_user.id, 'review',
    CONCAT(NEW.name, ' added a review for trip "', trip.title,
           '" with rating ', NEW.rating),
    NEW.user_id, NEW.name, author.email, NEW.avatar_url,
    NEW.trip_id, UUID(), 'review', NEW.id, NOW(), 0
  FROM users AS admin_user
  JOIN users AS author ON author.id = NEW.user_id
  JOIN trips AS trip ON trip.id = NEW.trip_id
  WHERE admin_user.role = 'ADMIN';
END$$

CREATE TRIGGER after_review_like_insert
AFTER INSERT ON review_likes
FOR EACH ROW
BEGIN
  INSERT INTO notifications (
    id, admin_id, event_type, message, user_id, user_name, user_email,
    user_image, trip_id, message_id, type, comment_id, created_at, is_read
  )
  SELECT UUID(), admin_user.id, 'like',
    CONCAT(liked_by.name, ' liked a review on trip "', trip.title, '"'),
    NEW.user_id, liked_by.name, liked_by.email, liked_by.avatar_url,
    NEW.trip_id, UUID(), 'like', NEW.review_id, NOW(), 0
  FROM users AS admin_user
  JOIN users AS liked_by ON liked_by.id = NEW.user_id
  JOIN reviews AS review ON review.id = NEW.review_id
  JOIN trips AS trip ON trip.id = NEW.trip_id
  WHERE admin_user.role = 'ADMIN';
END$$

CREATE TRIGGER notify_booking_insert
AFTER INSERT ON purchases
FOR EACH ROW
BEGIN
  INSERT INTO notifications (
    id, admin_id, event_type, message, user_id, user_name, user_email,
    user_image, trip_id, message_id, type, created_at, is_read
  )
  SELECT UUID(), admin_user.id, 'purchase',
    CONCAT('User ', NEW.user_name, ' booked trip ', NEW.trip_id),
    NEW.user_id, NEW.user_name, NEW.user_email, NEW.user_image,
    NEW.trip_id, UUID(), 'purchase', NOW(), 0
  FROM users AS admin_user
  WHERE admin_user.role = 'ADMIN';
END$$

CREATE TRIGGER after_purchase_update
AFTER UPDATE ON purchases
FOR EACH ROW
BEGIN
  IF NEW.status = 'Cancelled' AND OLD.status <> 'Cancelled' THEN
    INSERT INTO notifications (
      id, admin_id, event_type, message, user_id, user_name, user_email,
      user_image, trip_id, message_id, type, created_at, is_read
    )
    SELECT UUID(), admin_user.id, 'cancel',
      CONCAT('User ', NEW.user_name, ' cancelled trip ', NEW.trip_id),
      NEW.user_id, NEW.user_name, NEW.user_email, NEW.user_image,
      NEW.trip_id, UUID(), 'cancel', NOW(), 0
    FROM users AS admin_user
    WHERE admin_user.role = 'ADMIN';
  END IF;
END$$

DELIMITER ;
