-- Supabase Database Schema for Workshop Registrations
-- Run this SQL in your Supabase SQL Editor

-- Create the workshop_registrations table
CREATE TABLE IF NOT EXISTS workshop_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Student Information
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_grade TEXT NOT NULL,
  student_experience TEXT NOT NULL,
  
  -- Parent/Guardian Information
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  
  -- Workshop Information
  workshop_level TEXT NOT NULL,
  workshop_event_id TEXT NOT NULL, -- Unique identifier for each workshop event
  motivation TEXT DEFAULT '', -- Optional: Student interest, expectations, or suggestions
  
  -- Status: 'registered', 'waitlisted', 'confirmed', 'cancelled'
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'waitlisted', 'confirmed', 'cancelled')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: One registration per student per event
  UNIQUE(student_email, workshop_event_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_workshop_event ON workshop_registrations(workshop_event_id);
CREATE INDEX IF NOT EXISTS idx_student_email ON workshop_registrations(student_email);
CREATE INDEX IF NOT EXISTS idx_status ON workshop_registrations(status);
CREATE INDEX IF NOT EXISTS idx_created_at ON workshop_registrations(created_at);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on row update
DROP TRIGGER IF EXISTS update_workshop_registrations_updated_at ON workshop_registrations;
CREATE TRIGGER update_workshop_registrations_updated_at 
    BEFORE UPDATE ON workshop_registrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (for registration form)
-- This allows anonymous users to insert new registrations
DROP POLICY IF EXISTS "Allow public inserts" ON workshop_registrations;
CREATE POLICY "Allow public inserts" ON workshop_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Restrict reads (only authenticated users can read)
-- Adjust this based on your needs - you may want to allow reads for specific roles
DROP POLICY IF EXISTS "Restrict reads" ON workshop_registrations;
CREATE POLICY "Restrict reads" ON workshop_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- IMPORTANT: If you're getting RLS errors, run this to verify policies:
-- SELECT * FROM pg_policies WHERE tablename = 'workshop_registrations';

-- Optional: Create a view for easy querying
CREATE OR REPLACE VIEW registration_summary AS
SELECT 
  workshop_event_id,
  workshop_level,
  status,
  COUNT(*) as registration_count,
  COUNT(*) FILTER (WHERE status = 'registered') as registered_count,
  COUNT(*) FILTER (WHERE status = 'waitlisted') as waitlisted_count
FROM workshop_registrations
GROUP BY workshop_event_id, workshop_level, status;

