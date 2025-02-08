/*
  # Create proposals table

  1. New Tables
    - `proposals`
      - `id` (uuid, primary key)
      - `title` (text)
      - `field` (text)
      - `summary` (text)
      - `background` (text)
      - `objective` (text)
      - `approach` (text)
      - `expected_outcome` (text)
      - `collaboration` (text)
      - `budget` (text)
      - `period` (text)
      - `status` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `proposals` table
    - Add policies for authenticated users to manage their own proposals
    - Add policy for public read access to approved proposals
*/

CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  field text NOT NULL,
  summary text NOT NULL,
  background text NOT NULL,
  objective text NOT NULL,
  approach text NOT NULL,
  expected_outcome text NOT NULL,
  collaboration text NOT NULL,
  budget text NOT NULL,
  period text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own proposals
CREATE POLICY "Users can manage their own proposals"
  ON proposals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for public read access to approved proposals
CREATE POLICY "Public can view approved proposals"
  ON proposals
  FOR SELECT
  TO public
  USING (status = 'published');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();