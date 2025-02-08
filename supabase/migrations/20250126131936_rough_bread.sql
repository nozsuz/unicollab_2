/*
  # Fix profiles table and add user_id column

  1. Changes
    - Add user_id column to link profiles with auth.users
    - Update RLS policies to use user_id for authorization
    - Add unique constraint on user_id to ensure one profile per user

  2. Security
    - Update RLS policies to properly scope access based on user_id
    - Maintain existing storage policies
*/

-- Add user_id column and foreign key constraint
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Add unique constraint on user_id
ALTER TABLE profiles
ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can manage their own profile" ON profiles;

-- Create new RLS policies with user_id checks
CREATE POLICY "Public can view profiles"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own profile"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update existing rows to set user_id (if needed)
-- This is safe as it only affects rows where user_id is null
UPDATE profiles
SET user_id = auth.uid()
WHERE user_id IS NULL;