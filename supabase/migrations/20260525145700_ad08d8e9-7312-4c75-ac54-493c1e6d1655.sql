-- Add reviewer role to app_role enum and helper function
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'reviewer';

-- Need to commit enum change before using; use a separate function
