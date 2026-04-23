const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:MdUTn4rP8Y1X4IFk-@db.owzkuyzzdgwyoyghrsjn.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase!");

    // Set up schema
    const sql = `
      -- 1. Create Profiles table (links to auth.users)
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT,
        name TEXT,
        role TEXT CHECK (role IN ('ngo', 'volunteer', 'admin')),
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- 2. Create Incidents table
      CREATE TABLE IF NOT EXISTS public.incidents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        priority TEXT NOT NULL CHECK (priority IN ('CRITICAL', 'HIGH', 'MEDIUM', 'NORMAL', 'LOW')),
        status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'In Transit', 'Resolved')),
        affected TEXT,
        description TEXT,
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- 3. Create Missions table
      CREATE TABLE IF NOT EXISTS public.missions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
        volunteer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'Assigned' CHECK (status IN ('Assigned', 'In Progress', 'Completed')),
        assigned_role TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- 4. Create Notifications table
      CREATE TABLE IF NOT EXISTS public.notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('alert', 'ai', 'volunteer', 'system')),
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      -- Relax RLS for hackathon (Enable RLS but allow authenticated users to do anything)
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

      -- Create policies
      DO $$ BEGIN
        CREATE POLICY "Allow all for authenticated users" ON public.profiles FOR ALL TO authenticated USING (true);
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      DO $$ BEGIN
        CREATE POLICY "Allow all for authenticated users" ON public.incidents FOR ALL TO authenticated USING (true);
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      DO $$ BEGIN
        CREATE POLICY "Allow all for authenticated users" ON public.missions FOR ALL TO authenticated USING (true);
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      DO $$ BEGIN
        CREATE POLICY "Allow all for authenticated users" ON public.notifications FOR ALL TO authenticated USING (true);
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;

      -- Allow inserting profile on signup automatically via trigger
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.profiles (id, email, name, avatar_url, role)
        VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', null);
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `;

    await client.query(sql);
    console.log("Schema successfully created!");

  } catch (err) {
    console.error("Error setting up DB:", err);
  } finally {
    await client.end();
  }
}

run();
