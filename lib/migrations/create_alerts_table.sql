-- Create the alerts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.alerts (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  severity TEXT NOT NULL DEFAULT 'info'
);

-- Add real-time replication for the alerts table
ALTER TABLE public.alerts REPLICA IDENTITY FULL;

-- Create sample alerts if the table is empty
INSERT INTO public.alerts (type, message, severity, date)
SELECT 'ACCESS_CONTROL', 'Fingerprint access disabled', 'info', NOW() - INTERVAL '6 hours'
WHERE NOT EXISTS (SELECT 1 FROM public.alerts LIMIT 1);

INSERT INTO public.alerts (type, message, severity, date)
SELECT 'ACCESS_CONTROL', 'RFID access disabled', 'info', NOW() - INTERVAL '6 hours'
WHERE NOT EXISTS (SELECT 1 FROM public.alerts LIMIT 1);

INSERT INTO public.alerts (type, message, severity, date)
SELECT 'ACCESS_CONTROL', 'Fingerprint access enabled', 'info', NOW() - INTERVAL '6 hours'
WHERE NOT EXISTS (SELECT 1 FROM public.alerts LIMIT 1);

INSERT INTO public.alerts (type, message, severity, date)
SELECT 'ACCESS_CONTROL', 'RFID access enabled', 'info', NOW() - INTERVAL '6 hours'
WHERE NOT EXISTS (SELECT 1 FROM public.alerts LIMIT 1);

INSERT INTO public.alerts (type, message, severity, date)
SELECT 'SYSTEM', 'System updated to version 2.1.0', 'info', NOW() - INTERVAL '6 hours'
WHERE NOT EXISTS (SELECT 1 FROM public.alerts LIMIT 1); 