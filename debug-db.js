const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:MdUTn4rP8Y1X4IFk-@db.owzkuyzzdgwyoyghrsjn.supabase.co:5432/postgres', ssl: { rejectUnauthorized: false } });
client.connect().then(async () => {
  const res = await client.query(`
    SELECT column_name, is_nullable, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND table_schema = 'public';
  `);
  console.log("Columns:", res.rows);
  const res2 = await client.query(`
    SELECT conname, pg_get_constraintdef(oid) 
    FROM pg_constraint 
    WHERE conrelid = 'public.profiles'::regclass;
  `);
  console.log("Constraints:", res2.rows);

  const res3 = await client.query(`
    SELECT proname, prosrc 
    FROM pg_proc 
    WHERE proname = 'handle_new_user';
  `);
  console.log("Trigger Func:", res3.rows[0].prosrc);

  client.end();
}).catch(console.error);
