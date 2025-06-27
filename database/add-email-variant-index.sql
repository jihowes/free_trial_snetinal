-- Add email_variant_index column to users table for rotating email messages
ALTER TABLE users
ADD COLUMN email_variant_index INTEGER DEFAULT 0;

-- Add a comment to document the column
COMMENT ON COLUMN users.email_variant_index IS 'Index for rotating email message variants (0-11, loops back to 0)'; 