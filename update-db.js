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

    const sql = `
      -- Create NLP Extractions table
      CREATE TABLE IF NOT EXISTS public.nlp_extractions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
        role_tag TEXT CHECK (role_tag IN ('ngo', 'volunteer', 'admin')),
        raw_text TEXT,
        extracted_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      ALTER TABLE public.nlp_extractions ENABLE ROW LEVEL SECURITY;

      DO $$ BEGIN
        CREATE POLICY "Allow all for authenticated users" ON public.nlp_extractions FOR ALL TO authenticated USING (true);
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `;

    await client.query(sql);
    console.log("nlp_extractions table successfully created!");

  } catch (err) {
    console.error("Error setting up DB:", err);
  } finally {
    await client.end();
  }
}

run();
