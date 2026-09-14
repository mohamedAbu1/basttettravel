ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS message_type varchar(30) NOT NULL DEFAULT 'chat';

CREATE TABLE IF NOT EXISTS conversation_typing (
  user_id uuid NOT NULL,
  user_typing tinyint(1) NOT NULL DEFAULT 0,
  admin_typing tinyint(1) NOT NULL DEFAULT 0,
  user_updated_at timestamp NULL DEFAULT NULL,
  admin_updated_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NOT NULL,
  PRIMARY KEY (user_id),
  CONSTRAINT conversation_typing_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
