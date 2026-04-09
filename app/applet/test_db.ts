import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://vkcwjebggauutgoawlre.supabase.co', 'sb_publishable_9ZQdAh5vk1LIx8OcAd2jjA_oasoRI4K');
async function test() {
  const { data, error } = await supabase.from('garden_stats').select('*').limit(1);
  console.log(JSON.stringify(data, null, 2));
  console.log(error);
}
test();
