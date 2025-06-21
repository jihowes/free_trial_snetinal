# Free Trial Sentinel

A web application to track free software trials and receive email reminders before they expire to avoid unwanted charges.

## Features

- 🔐 **User Authentication**: Secure signup and login with Supabase Auth
- 📊 **Trial Management**: Add, view, and delete your free trials
- ⏰ **Smart Reminders**: Get email notifications 7 days and 1 day before trial expiry
- 🎨 **Modern UI**: Clean, dark-themed interface built with Tailwind CSS
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd free_trial_snetinal
npm install
```

### 2. Set Up Supabase Project

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project dashboard
3. Navigate to **SQL Editor** and run the following SQL to create the trials table:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create trials table
CREATE TABLE trials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_notified TIMESTAMPTZ NULL
);

-- Create RLS policies
ALTER TABLE trials ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see only their own trials
CREATE POLICY "Users can view own trials" ON trials
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own trials
CREATE POLICY "Users can insert own trials" ON trials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own trials
CREATE POLICY "Users can update own trials" ON trials
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own trials
CREATE POLICY "Users can delete own trials" ON trials
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. Configure Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env.local
```

2. Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Deploy the Edge Function

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

4. Deploy the Edge Function:
```bash
supabase functions deploy check-trials
```

### 5. Set Up Cron Job

1. Go to your Supabase dashboard
2. Navigate to **Database** > **Functions**
3. Find the `check-trials` function
4. Click on **Settings** and configure the cron schedule:
   - **Schedule**: `0 9 * * *` (runs daily at 9 AM UTC)
   - **HTTP Method**: GET

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Sign Up**: Create a new account with your email
2. **Add Trials**: Click "Add New Trial" and enter the service name and end date
3. **Track Trials**: View all your trials on the dashboard with expiry status
4. **Get Reminders**: Receive email notifications 7 days and 1 day before expiry
5. **Manage Trials**: Delete trials you no longer need to track

## Project Structure

```
free_trial_snetinal/
├── app/                          # Next.js App Router pages
│   ├── auth/callback/            # Supabase auth callback
│   ├── dashboard/                # Protected dashboard pages
│   ├── login/                    # Login page
│   ├── signup/                   # Signup page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (redirects to login)
├── components/                   # Reusable UI components
│   └── ui/                       # Base UI components
├── lib/                          # Utility functions
│   ├── auth.ts                   # Auth utilities
│   └── supabase.ts               # Supabase client
├── supabase/                     # Supabase configuration
│   └── functions/                # Edge Functions
│       └── check-trials/         # Cron job for email reminders
├── env.example                   # Environment variables template
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own needs!

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 
