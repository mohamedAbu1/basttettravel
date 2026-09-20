ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS attachment_path varchar(500) NULL,
  ADD COLUMN IF NOT EXISTS attachment_name varchar(255) NULL,
  ADD COLUMN IF NOT EXISTS attachment_mime varchar(150) NULL,
  ADD COLUMN IF NOT EXISTS attachment_size bigint unsigned NULL;
