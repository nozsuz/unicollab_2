/*
  # Add proposals table

  1. New Tables
    - `proposals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
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
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `proposals` table
    - Add policies for authenticated users to manage their own proposals
    - Add policy for public to view published proposals
*/

-- Create proposals table
CREATE TABLE proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX proposals_user_id_idx ON proposals(user_id);
CREATE INDEX proposals_status_idx ON proposals(status);
CREATE INDEX proposals_created_at_idx ON proposals(created_at DESC);

-- Create RLS policies
CREATE POLICY "Users can manage their own proposals"
  ON proposals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view published proposals"
  ON proposals
  FOR SELECT
  TO public
  USING (status = 'published');

-- Add updated_at trigger
CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();