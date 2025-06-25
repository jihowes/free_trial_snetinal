-- Create curated_trials table for the explore page
CREATE TABLE curated_trials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_name TEXT NOT NULL,
  trial_length_days INTEGER NOT NULL,
  category TEXT NOT NULL,
  geo_availability TEXT[] DEFAULT ARRAY['🌍'], -- Array of emoji flags
  affiliate_link TEXT NOT NULL,
  sentinel_score INTEGER DEFAULT 50 CHECK (sentinel_score >= 0 AND sentinel_score <= 100),
  description TEXT,
  monthly_price DECIMAL(10,2),
  billing_frequency TEXT DEFAULT 'monthly',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trial_clicks table for tracking analytics
CREATE TABLE trial_clicks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trial_id UUID REFERENCES curated_trials(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);

-- Create indexes for better performance
CREATE INDEX idx_curated_trials_category ON curated_trials(category);
CREATE INDEX idx_curated_trials_active ON curated_trials(is_active);
CREATE INDEX idx_trial_clicks_trial_id ON trial_clicks(trial_id);
CREATE INDEX idx_trial_clicks_user_id ON trial_clicks(user_id);
CREATE INDEX idx_trial_clicks_timestamp ON trial_clicks(timestamp);

-- Insert some sample curated trials
INSERT INTO curated_trials (service_name, trial_length_days, category, geo_availability, affiliate_link, sentinel_score, description, monthly_price) VALUES
('Netflix', 30, 'Streaming', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://netflix.com', 85, 'Stream unlimited movies and TV shows', 15.99),
('Spotify Premium', 30, 'Music', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://spotify.com', 90, 'Ad-free music streaming with offline downloads', 9.99),
('Disney+', 7, 'Streaming', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://disneyplus.com', 75, 'Disney, Pixar, Marvel, Star Wars content', 7.99),
('Hulu', 30, 'Streaming', ARRAY['🇺🇸'], 'https://hulu.com', 80, 'Current TV shows and movies', 7.99),
('HBO Max', 7, 'Streaming', ARRAY['🇺🇸'], 'https://hbomax.com', 85, 'Premium TV series and movies', 14.99),
('Amazon Prime', 30, 'Streaming', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://amazon.com/prime', 88, 'Movies, TV, music, and free shipping', 12.99),
('Apple TV+', 7, 'Streaming', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://tv.apple.com', 70, 'Apple original content', 4.99),
('Paramount+', 7, 'Streaming', ARRAY['🇺🇸'], 'https://paramountplus.com', 65, 'CBS, Comedy Central, and Paramount content', 4.99),
('Apple Music', 3, 'Music', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://music.apple.com', 85, 'Ad-free music with spatial audio', 9.99),
('YouTube Music', 30, 'Music', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://music.youtube.com', 75, 'Music videos and background play', 9.99),
('Steam', 0, 'Gaming', ARRAY['🌍'], 'https://store.steampowered.com', 90, 'Free games and sales', 0),
('Xbox Game Pass', 14, 'Gaming', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://xbox.com/gamepass', 88, 'Hundreds of games for one price', 14.99),
('Adobe Creative Cloud', 7, 'Software', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://adobe.com/creativecloud', 92, 'Professional design tools', 52.99),
('Microsoft 365', 30, 'Software', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://microsoft365.com', 85, 'Office apps and cloud storage', 6.99);

-- Enable RLS on curated_trials (read-only for all users)
ALTER TABLE curated_trials ENABLE ROW LEVEL SECURITY;

-- Allow all users to read curated trials
CREATE POLICY "Anyone can view curated trials" ON curated_trials
  FOR SELECT USING (true);

-- Only admins can modify curated trials (you can add admin check later)
CREATE POLICY "Admins can modify curated trials" ON curated_trials
  FOR ALL USING (false); -- Disabled for now, enable when admin system is in place

-- Enable RLS on trial_clicks
ALTER TABLE trial_clicks ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own clicks
CREATE POLICY "Users can insert trial clicks" ON trial_clicks
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to view their own clicks
CREATE POLICY "Users can view own trial clicks" ON trial_clicks
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow admins to view all clicks (for analytics)
CREATE POLICY "Admins can view all trial clicks" ON trial_clicks
  FOR SELECT USING (false); -- Disabled for now, enable when admin system is in place 