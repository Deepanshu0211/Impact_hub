const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:MdUTn4rP8Y1X4IFk-@db.owzkuyzzdgwyoyghrsjn.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});
async function run() {
  await client.connect();
  
  console.log("--- TRIGGERS on auth.users ---");
  const triggerRes = await client.query(`
    SELECT tgname, tgrelid::regclass, tgfoid::regproc 
    FROM pg_trigger 
    WHERE tgrelid = 'auth.users'::regclass;
  `);
  console.log(triggerRes.rows);

  console.log("--- TRIGGER FUNCTIONS ---");
  const fnRes = await client.query(`
    SELECT proname, prosrc 
    FROM pg_proc 
    WHERE proname IN (
      SELECT tgfoid::regproc::text 
      FROM pg_trigger 
      WHERE tgrelid = 'auth.users'::regclass
    ) OR proname LIKE 'handle_new_user';
  `);
  console.log(fnRes.rows);

  await client.end();
}
run();
