CREATE TABLE IF NOT EXISTS seasonal_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_key VARCHAR(40) NOT NULL UNIQUE,
  label VARCHAR(120) NOT NULL,
  theme VARCHAR(40) NOT NULL,
  annual TINYINT(1) NOT NULL DEFAULT 0,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  discount DECIMAL(5,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO seasonal_events
  (event_key, label, theme, annual, enabled, start_date, end_date, discount)
VALUES
  ('valentinesDay', 'Valentine''s Day', 'valentines-day', 1, 1, '2026-02-14', '2026-02-16', 15);
