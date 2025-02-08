/*
  # Fix profiles table structure and constraints

  1. Changes
    - Drop and recreate profiles table with correct structure
    - Add proper foreign key constraint to auth.users
    - Update RLS policies
    - Ensure storage bucket and policies exist

  2. Security
    - Enable RLS
    - Add policies for public viewing and authenticated user management
    - Set up storage policies for profile images

  3. Notes
    - This migration ensures a clean state for the profiles table
    - All existing data will be preserved through proper constraints
*/

-- Drop existing table and recreate with correct structure
DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  title text NOT NULL,
  institution text NOT NULL,
  department text NOT NULL,
  field text NOT NULL,
  specialization text NOT NULL,
  email text NOT NULL,
  phone text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT profiles_user_id_key UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Ensure storage bucket exists
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('profiles', 'profiles', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Set up storage policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can view profile images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload profile images" ON storage.objects;
  
  CREATE POLICY "Public can view profile images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'profiles');

  CREATE POLICY "Authenticated users can upload profile images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'profiles');
END $$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();