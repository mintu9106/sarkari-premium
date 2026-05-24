-- SQL Schema for Sarkari Premium Jobs Portal
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/glcqiynwytollsskpkcs/sql/new)

CREATE TABLE IF NOT EXISTS public.jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT NOT NULL,
    state TEXT,
    district TEXT,
    overview TEXT NOT NULL,
    eligibility JSONB, -- Stored as JSONB to support structured eligibility lists/objects
    age_limit TEXT,
    salary TEXT,
    important_dates JSONB, -- Stored as JSONB to hold start_date, end_date, exam_date
    how_to_apply TEXT,
    apply_link TEXT,
    official_pdf_link TEXT,
    slug TEXT UNIQUE NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (Read-Only)
CREATE POLICY "Allow public read access" ON public.jobs
    FOR SELECT TO public USING (true);

-- Create policies for service role access (Full Control for Scraper)
CREATE POLICY "Allow service_role full access" ON public.jobs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create index on slug for fast route fetching
CREATE INDEX IF NOT EXISTS jobs_slug_idx ON public.jobs (slug);

-- Create index on category for fast landing page rendering
CREATE INDEX IF NOT EXISTS jobs_category_idx ON public.jobs (category);
