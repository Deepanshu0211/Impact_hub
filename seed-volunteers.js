const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:MdUTn4rP8Y1X4IFk-@db.owzkuyzzdgwyoyghrsjn.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

const volunteers = [
  { name: "Priya Singh", email: "priya.mock@impacthub.org", skills: ["medical", "counseling"], distance_km: 0.8, available: true },
  { name: "Arjun Mehta", email: "arjun.mock@impacthub.org", skills: ["construction", "electrical"], distance_km: 2.1, available: false },
  { name: "Kavya Nair", email: "kavya.mock@impacthub.org", skills: ["first-aid", "food-distribution"], distance_km: 4.0, available: true },
];

// Fallback logic to just ensure Anita and Raj have their profiles updated correctly if they were created earlier
const previouslyCreated = [
  { name: "Anita Sharma", email: "anita.mock@impacthub.org", skills: ["first-aid", "water-purification"], distance_km: 1.2, available: true },
  { name: "Raj Patel", email: "raj.mock@impacthub.org", skills: ["logistics", "driving"], distance_km: 3.5, available: true },
];

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase via Postgres!");

    for (const v of volunteers) {
      // Create random UUID
      const uuidRes = await client.query('SELECT gen_random_uuid() as id');
      const id = uuidRes.rows[0].id;
      
      const rawMetaData = JSON.stringify({ full_name: v.name });
      
      // Insert into auth.users (This will trigger profile creation)
      await client.query(`
        INSERT INTO auth.users (id, aud, role, email, raw_user_meta_data)
        VALUES ($1, 'authenticated', 'authenticated', $2, $3)
      `, [id, v.email, rawMetaData]);
      
      // Update profile
      const metadata = JSON.stringify({ skills: v.skills, distance_km: v.distance_km, available: v.available });
      await client.query(`
        UPDATE public.profiles
        SET role = 'volunteer', metadata = $1
        WHERE id = $2
      `, [metadata, id]);
      
      console.log(`Successfully seeded volunteer: ${v.name}`);
    }

    // Update previously created
    for (const v of previouslyCreated) {
      const metadata = JSON.stringify({ skills: v.skills, distance_km: v.distance_km, available: v.available });
      await client.query(`
        UPDATE public.profiles
        SET role = 'volunteer', metadata = $1
        WHERE email = $2
      `, [metadata, v.email]);
      console.log(`Updated metadata for: ${v.name}`);
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
