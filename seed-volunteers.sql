-- ===========================================================================
-- IMPACT HUB: VOLUNTEER SEED DATA (UPSERT SAFE)
-- Copy and paste this into your Supabase SQL Editor and click "RUN".
-- ===========================================================================

DO $$
DECLARE
  v_email TEXT;
  v_name TEXT;
  v_metadata JSONB;
  v_id UUID;
BEGIN
  -- 1. Anita
  v_email := 'anita.mock@impacthub.org';
  v_name := 'Anita Sharma';
  v_metadata := '{"skills": ["first-aid", "water-purification", "coordination"], "distance_km": 1.2, "available": true}'::jsonb;
  
  SELECT id INTO v_id FROM auth.users WHERE email = v_email;
  IF v_id IS NULL THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', v_email, 'fake_password_hash', now(), '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('full_name', v_name), now(), now());
  END IF;
  UPDATE public.profiles SET role = 'volunteer', metadata = v_metadata WHERE id = v_id;

  -- 2. Raj
  v_email := 'raj.mock@impacthub.org';
  v_name := 'Raj Patel';
  v_metadata := '{"skills": ["logistics", "driving", "heavy-lifting"], "distance_km": 3.5, "available": true}'::jsonb;
  
  SELECT id INTO v_id FROM auth.users WHERE email = v_email;
  IF v_id IS NULL THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', v_email, 'fake_password_hash', now(), '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('full_name', v_name), now(), now());
  END IF;
  UPDATE public.profiles SET role = 'volunteer', metadata = v_metadata WHERE id = v_id;

  -- 3. Priya
  v_email := 'priya.mock@impacthub.org';
  v_name := 'Priya Singh';
  v_metadata := '{"skills": ["medical", "counseling", "pediatrics"], "distance_km": 0.8, "available": true}'::jsonb;
  
  SELECT id INTO v_id FROM auth.users WHERE email = v_email;
  IF v_id IS NULL THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', v_email, 'fake_password_hash', now(), '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('full_name', v_name), now(), now());
  END IF;
  UPDATE public.profiles SET role = 'volunteer', metadata = v_metadata WHERE id = v_id;

  -- 4. Arjun
  v_email := 'arjun.mock@impacthub.org';
  v_name := 'Arjun Mehta';
  v_metadata := '{"skills": ["construction", "electrical", "search-and-rescue"], "distance_km": 2.1, "available": false}'::jsonb;
  
  SELECT id INTO v_id FROM auth.users WHERE email = v_email;
  IF v_id IS NULL THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', v_email, 'fake_password_hash', now(), '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('full_name', v_name), now(), now());
  END IF;
  UPDATE public.profiles SET role = 'volunteer', metadata = v_metadata WHERE id = v_id;

  -- 5. Kavya
  v_email := 'kavya.mock@impacthub.org';
  v_name := 'Kavya Nair';
  v_metadata := '{"skills": ["first-aid", "food-distribution", "crowd-management"], "distance_km": 4.0, "available": true}'::jsonb;
  
  SELECT id INTO v_id FROM auth.users WHERE email = v_email;
  IF v_id IS NULL THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', v_email, 'fake_password_hash', now(), '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('full_name', v_name), now(), now());
  END IF;
  UPDATE public.profiles SET role = 'volunteer', metadata = v_metadata WHERE id = v_id;

END $$;
