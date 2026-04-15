import { createClient } from './server';
import type { Content } from '@/lib/types/content';

export async function searchContents(query: string): Promise<Content[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('is_published', true)
    .ilike('search_text', `%${query}%`)
    .order('updated_at', { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function searchItems(query: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('items')
    .select('*, locations(*)')
    .ilike('name', `%${query}%`)
    .limit(10);

  if (error) throw new Error(error.message);
  return data ?? [];
}
