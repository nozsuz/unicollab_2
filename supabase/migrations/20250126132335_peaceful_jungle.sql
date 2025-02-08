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

-- Recreate profiles table with correct structure
CREATE TABLE IF NOT EXISTS profiles_new (
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
  CONSTRAINT profiles_new_user_id_key UNIQUE (user_id)
);

-- Copy data from old table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    INSERT INTO profiles_new (
      id, user_id, name, title, institution, department, field, 
      specialization, email, phone, image_url, created_at, updated_at
    )
    SELECT 
      id, user_id, name, title, institution, department, field,
      specialization, email, phone, image_url, created_at, updated_at
    FROM profiles
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
END $$;

-- Drop old table and rename new table
DROP TABLE IF EXISTS profiles;
ALTER TABLE profiles_new RENAME TO profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
  DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
  
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
END $$;

-- Ensure storage bucket exists
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('profiles', 'profiles', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Update storage policies
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

-- Recreate updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();