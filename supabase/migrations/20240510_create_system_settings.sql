
-- Create system settings table for storing application configs
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add initial minimum withdrawal setting
INSERT INTO public.system_settings (key, value)
VALUES ('minimum_withdrawal', '{"amount": 10}')
ON CONFLICT (key) DO NOTHING;

-- Add status and ban_reason columns to artists table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns 
                 WHERE table_name = 'artists' AND column_name = 'status') THEN
    ALTER TABLE public.artists ADD COLUMN status TEXT DEFAULT 'active';
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.columns 
                 WHERE table_name = 'artists' AND column_name = 'ban_reason') THEN
    ALTER TABLE public.artists ADD COLUMN ban_reason TEXT;
  END IF;
END $$;

-- Update existing artists with default status if null
UPDATE public.artists SET status = 'active' WHERE status IS NULL;
