/*
  # Fix profiles table structure

  1. Changes
    - Drop existing profiles table
    - Create new profiles table with correct structure
    - Add proper indexes and constraints
    - Set up RLS policies correctly

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Drop existing table
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
CREATE INDEX profiles_user_id_idx ON profiles(user_id);
CREATE INDEX profiles_email_idx ON profiles(email);
CREATE INDEX profiles_field_idx ON profiles(field);

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