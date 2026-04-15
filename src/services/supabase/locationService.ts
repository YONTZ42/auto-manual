import { createClient } from './server';
import type { Location } from '@/lib/types/location';

export async function getLocations(storeId?: string): Promise<Location[]> {
  const supabase = await createClient();
  let query = supabase
    .from('locations')
    .select('*, items(*)')
    .order('sort_order', { ascending: true });

  if (storeId) query = query.eq('store_id', storeId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLocationById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('locations')
    .select('*, items(*, content_block_items(content_blocks(contents(*))))')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
