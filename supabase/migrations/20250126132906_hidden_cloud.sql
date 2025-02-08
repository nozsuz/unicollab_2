/*
  # Fix profiles table schema and relationships

  1. Changes
    - Drop and recreate profiles table with correct structure
    - Add proper indexes and constraints
    - Set up RLS policies
    - Configure storage policies for profile images

  2. Security
    - Enable RLS
    - Add policies for profile management
    - Set up storage access controls

  3. Notes
    - This migration consolidates previous profile-related migrations
    - Ensures proper table structure and relationships
*/

-- Drop existing profiles table if it exists
DROP TABLE IF EXISTS profiles;

-- Create profiles table with correct structure
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

-- Create indexes
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_field_idx ON profiles(field);

-- Create RLS policies
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
  -- View policy
  CREATE POLICY "Public can view profile images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'profiles');

  -- Upload policy
  CREATE POLICY "Authenticated users can upload profile images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'profiles');

  -- Delete policy
  CREATE POLICY "Users can delete their own profile images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'profiles' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );

  -- Update policy
  CREATE POLICY "Users can update their own profile images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'profiles' AND
      (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
      bucket_id = 'profiles' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
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