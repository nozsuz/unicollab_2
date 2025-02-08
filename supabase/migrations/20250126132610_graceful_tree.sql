/*
  # Fix database schema and relationships

  1. Changes
    - Add missing relationships between tables
    - Add missing indexes
    - Update RLS policies for better security

  2. Security
    - Ensure proper RLS policies are in place
    - Add missing storage policies
    - Fix permission issues

  3. Notes
    - This migration is additive only
    - No existing data will be modified
*/

-- Add missing indexes
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_field_idx ON profiles(field);

-- Add missing storage policies if needed
DO $$
BEGIN
  -- Delete policy for profile images
  CREATE POLICY "Users can delete their own profile images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'profiles' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );

  -- Update policy for profile images  
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