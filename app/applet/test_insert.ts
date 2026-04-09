import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vkcwjebggauutgoawlre.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_9ZQdAh5vk1LIx8OcAd2jjA_oasoRI4K';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('garden_stats').insert({
    device_id: 'TEST-001',
    sensor_name: 'owner_email',
    value: 'test@example.com'
  });
  console.log('insert string:', { data, error });
}

test();
