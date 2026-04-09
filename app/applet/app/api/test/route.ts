import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vkcwjebggauutgoawlre.supabase.co', 'sb_publishable_9ZQdAh5vk1LIx8OcAd2jjA_oasoRI4K');

export async function GET() {
  const { data, error } = await supabase.rpc('get_columns', { table_name: 'garden_stats' });
  if (error) {
    // fallback if rpc doesn't exist
    const { data: rows, error: err2 } = await supabase.from('garden_stats').select('*').limit(1);
    return NextResponse.json({ columns: rows && rows.length > 0 ? Object.keys(rows[0]) : [], error: err2 });
  }
  return NextResponse.json({ data, error });
}
