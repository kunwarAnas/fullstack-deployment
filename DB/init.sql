-- Create database
CREATE DATABASE tododb;

-- Create user
CREATE USER todo_user WITH PASSWORD 'password123';

-- Grant DB-level privileges
GRANT ALL PRIVILEGES ON DATABASE tododb TO todo_user;

-- Connect to the database
\c tododb

-- Create table
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Change table owner to app user (IMPORTANT)
ALTER TABLE todos OWNER TO todo_user;

-- Grant privileges on existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO todo_user;

-- Grant privileges on existing sequences (IMPORTANT for SERIAL)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO todo_user;

-- Ensure future tables/sequences are accessible
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO todo_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO todo_user;
