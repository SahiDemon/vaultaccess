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