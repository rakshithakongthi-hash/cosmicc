-- ==============================================================================
-- DisasterSense AI - Supabase Initial Schema
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Tables
CREATE TABLE public.raw_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL,
    author VARCHAR(100),
    content TEXT NOT NULL,
    post_url TEXT,
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analyzed BOOLEAN DEFAULT FALSE
);

CREATE TABLE public.analyzed_posts (
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

CREATE TABLE public.alerts (
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
    verification_status VARCHAR(50) NOT NULL, -- Verified, Needs Review, Likely Fake
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

CREATE TABLE public.agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
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

-- Allow anonymous read access for demo purposes (In production, restrict to authenticated users)
CREATE POLICY "Allow public read access on alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on analyzed posts" ON public.analyzed_posts FOR SELECT USING (true);

-- 4. Realtime Configuration
-- Enable realtime functionality for the alerts table
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;

-- 5. Functions & Triggers
-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_alerts_modtime
    BEFORE UPDATE ON public.alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
