-- Migration for Tier 1 Features

-- Add new columns to listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS available_from date,
ADD COLUMN IF NOT EXISTS min_stay_months integer DEFAULT 1;

-- JSONB columns 'features' and 'rules' already exist in listings
-- JSONB column 'preferences' already exists in users

-- Comment on columns for clarity
COMMENT ON COLUMN public.listings.features IS 'Stores attributes like size_m2, bed_type, amenities';
COMMENT ON COLUMN public.listings.rules IS 'Stores rules like pets_allowed, visitors_allowed';
