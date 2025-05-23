-- ==================================================================
-- RUN THIS SCRIPT IN THE SUPABASE SQL EDITOR (DASHBOARD > SQL EDITOR)
-- ==================================================================

-- Update the _history table to use a default timestamp if one is not provided
ALTER TABLE public._history 
ALTER COLUMN date SET DEFAULT NOW();

-- Add a trigger to update the date column whenever a row is inserted
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the timestamp on insert
DROP TRIGGER IF EXISTS set_timestamp ON public._history;
CREATE TRIGGER set_timestamp
BEFORE INSERT ON public._history
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Add real-time replication for the _history table (if not already enabled)
ALTER TABLE public._history REPLICA IDENTITY FULL;

-- Create some test entries to verify functionality
INSERT INTO public._history (using, output) 
VALUES ('TEST', 'Timestamp test entry');

-- View the result to confirm automatic timestamp
SELECT * FROM public._history 
ORDER BY id DESC 
LIMIT 10; 