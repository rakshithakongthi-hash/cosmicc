-- DisasterSense AI - Complete Non-Error Supabase Setup
-- Run this script in the Supabase SQL Editor to set up your database.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Tables

-- Raw Posts Table
CREATE TABLE IF NOT EXISTS public.raw_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL,
    author VARCHAR(100),
    content TEXT NOT NULL,
    post_url TEXT,
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analyzed BOOLEAN DEFAULT FALSE
);

-- Analyzed Posts Table
CREATE TABLE IF NOT EXISTS public.analyzed_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_post_id UUID REFERENCES public.raw_posts(id) ON DELETE CASCADE,
    is_disaster BOOLEAN NOT NULL,
    disaster_type VARCHAR(50),
    location VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    severity VARCHAR(20),
    urgency VARCHAR(20),
    confidence DOUBLE PRECISION,
    summary TEXT,
    recommended_action TEXT,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_type VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    severity VARCHAR(20) NOT NULL,
    urgency VARCHAR(20) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    credibility_score DOUBLE PRECISION NOT NULL,
    fake_probability DOUBLE PRECISION NOT NULL,
    verification_status VARCHAR(50) NOT NULL,
    summary TEXT,
    recommended_action TEXT,
    source_count INTEGER DEFAULT 1,
    weather_verified BOOLEAN DEFAULT FALSE,
    official_source_verified BOOLEAN DEFAULT FALSE,
    multi_source_verified BOOLEAN DEFAULT FALSE,
    verification_notes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agencies Table (Added UNIQUE constraint on email to support ON CONFLICT)
CREATE TABLE IF NOT EXISTS public.agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    region VARCHAR(100),
    contact_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
ALTER TABLE public.raw_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyzed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- Policies for public read access (Checks if policy exists first to avoid errors)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on alerts') THEN
        CREATE POLICY "Allow public read access on alerts" ON public.alerts FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on analyzed posts') THEN
        CREATE POLICY "Allow public read access on analyzed posts" ON public.analyzed_posts FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on agencies') THEN
        CREATE POLICY "Allow public read access on agencies" ON public.agencies FOR SELECT USING (true);
    END IF;
END $$;

-- 4. Realtime Configuration
-- Safely add table to publication if not already present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_rel pr
      JOIN pg_publication p ON p.oid = pr.prpubid
      JOIN pg_class c ON c.oid = pr.prrelid
      WHERE p.pubname = 'supabase_realtime' AND c.relname = 'alerts'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
    END IF;
  END IF;
END $$;

-- 5. Functions & Triggers
-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_alerts_modtime ON public.alerts;
CREATE TRIGGER update_alerts_modtime
    BEFORE UPDATE ON public.alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- 6. Seed Data (Uses email as unique identifier to avoid duplicates)
INSERT INTO public.agencies (name, email, region, is_active) VALUES
('National Emergency Agency', 'emergency@example.com', 'National', true),
('Red Cross', 'disaster@example.com', 'Global', true)
ON CONFLICT (email) DO NOTHING;
