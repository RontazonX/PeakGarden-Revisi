import { supabase } from '../lib/supabase';

async function checkSchema() {
  const { data, error } = await supabase.from('garden_stats').select('*').limit(1);
  console.log(data, error);
}
checkSchema();
