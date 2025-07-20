-- Add AI tools and other popular services to curated trials
INSERT INTO curated_trials (service_name, trial_length_days, category, geo_availability, affiliate_link, sentinel_score, description, monthly_price) VALUES
-- AI Tools
('ChatGPT Plus', 0, 'AI Tools', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://chat.openai.com', 95, 'Advanced AI chatbot with GPT-4 access', 20.00),
('Claude Pro', 0, 'AI Tools', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://claude.ai', 92, 'Anthropic\'s advanced AI assistant', 20.00),
('Midjourney', 0, 'AI Tools', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://midjourney.com', 88, 'AI-powered image generation', 10.00),
('Notion AI', 0, 'AI Tools', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://notion.so', 85, 'AI writing and organization assistant', 8.00),
('Grammarly Premium', 7, 'AI Tools', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://grammarly.com', 90, 'AI-powered writing assistant', 12.00),
('Copy.ai', 7, 'AI Tools', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://copy.ai', 82, 'AI copywriting and content generation', 36.00),
('Jasper', 7, 'AI Tools', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://jasper.ai', 87, 'AI content creation platform', 39.00),
('Runway ML', 7, 'AI Tools', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://runwayml.com', 89, 'AI video editing and generation', 12.00),
('ElevenLabs', 0, 'AI Tools', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://elevenlabs.io', 86, 'AI voice generation and cloning', 22.00),
('Synthesia', 7, 'AI Tools', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://synthesia.io', 84, 'AI video creation with avatars', 30.00),

-- Productivity & Business
('Notion', 0, 'Productivity', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://notion.so', 94, 'All-in-one workspace for notes and collaboration', 8.00),
('Figma', 0, 'Design', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://figma.com', 91, 'Collaborative design and prototyping', 12.00),
('Canva Pro', 30, 'Design', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://canva.com', 88, 'Graphic design platform with premium templates', 12.99),
('Slack', 0, 'Communication', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://slack.com', 89, 'Team communication and collaboration', 7.25),
('Zoom Pro', 0, 'Communication', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://zoom.us', 85, 'Video conferencing and webinars', 14.99),
('Trello Premium', 14, 'Productivity', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://trello.com', 83, 'Project management and task organization', 10.00),
('Asana Premium', 30, 'Productivity', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://asana.com', 86, 'Team project management and workflow', 10.99),
('Monday.com', 14, 'Productivity', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://monday.com', 84, 'Work operating system for teams', 8.00),
('ClickUp', 0, 'Productivity', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://clickup.com', 87, 'All-in-one productivity platform', 5.00),
('Airtable', 0, 'Productivity', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://airtable.com', 85, 'Database and spreadsheet hybrid', 10.00),

-- Development & Tech
('GitHub Copilot', 30, 'Development', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://github.com/features/copilot', 93, 'AI-powered code completion', 10.00),
('JetBrains All Products', 30, 'Development', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://jetbrains.com', 90, 'Professional development tools', 15.90),
('VS Code Pro', 0, 'Development', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://code.visualstudio.com', 88, 'Advanced code editor features', 4.00),
('Postman', 0, 'Development', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://postman.com', 86, 'API development and testing', 12.00),
('Figma Dev Mode', 0, 'Development', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://figma.com', 89, 'Design-to-code workflow', 12.00),

-- Creative & Media
('Adobe Lightroom', 7, 'Photography', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://adobe.com/lightroom', 91, 'Professional photo editing', 9.99),
('Figma', 0, 'Design', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://figma.com', 91, 'Collaborative design and prototyping', 12.00),
('Sketch', 30, 'Design', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://sketch.com', 88, 'Digital design for Mac', 9.00),
('Framer', 0, 'Design', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://framer.com', 87, 'Interactive design and prototyping', 10.00),
('Webflow', 0, 'Web Design', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://webflow.com', 89, 'Visual web design and CMS', 14.00),

-- Education & Learning
('Coursera Plus', 7, 'Education', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://coursera.org', 86, 'Unlimited access to courses and certificates', 59.00),
('Skillshare', 30, 'Education', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://skillshare.com', 84, 'Creative skills and classes', 32.00),
('MasterClass', 30, 'Education', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://masterclass.com', 88, 'Learn from world-class experts', 15.00),
('Duolingo Plus', 0, 'Education', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://duolingo.com', 82, 'Ad-free language learning', 6.99),
('Brilliant', 7, 'Education', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://brilliant.org', 85, 'Interactive math and science learning', 12.99),

-- Health & Fitness
('Headspace', 7, 'Health', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://headspace.com', 87, 'Meditation and mindfulness', 12.99),
('Calm', 7, 'Health', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://calm.com', 86, 'Meditation and sleep stories', 14.99),
('MyFitnessPal Premium', 30, 'Health', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://myfitnesspal.com', 83, 'Nutrition and fitness tracking', 19.99),
('Noom', 7, 'Health', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://noom.com', 85, 'Psychology-based weight loss', 59.00),
('Peloton App', 30, 'Health', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://onepeloton.com', 88, 'Fitness classes and workouts', 12.99),

-- Finance & Business
('Mint', 0, 'Finance', ARRAY['🇺🇸'], 'https://mint.intuit.com', 85, 'Personal finance and budgeting', 0),
('YNAB', 34, 'Finance', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://youneedabudget.com', 90, 'Zero-based budgeting system', 14.99),
('QuickBooks', 30, 'Finance', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://quickbooks.intuit.com', 87, 'Small business accounting', 30.00),
('FreshBooks', 30, 'Finance', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://freshbooks.com', 84, 'Invoicing and accounting software', 15.00),
('Stripe', 0, 'Finance', ARRAY['🌍', '🇺🇸', '🇦🇺'], 'https://stripe.com', 92, 'Payment processing for businesses', 0); 