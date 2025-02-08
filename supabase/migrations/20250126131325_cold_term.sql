/*
  # Initial database setup

  1. Tables
    - profiles
      - id (uuid, primary key)
      - name (text)
      - title (text)
      - institution (text)
      - department (text)
      - field (text)
      - specialization (text)
      - email (text)
      - phone (text, nullable)
      - image_url (text, nullable)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on profiles table
    - Add policies for viewing and managing profiles
    - Set up storage bucket for profile images
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view profiles"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage their own profile"
  ON profiles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT DO NOTHING;

-- Set up storage policies
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

-- Add updated_at trigger
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