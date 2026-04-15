import { createClient } from './server';
import type { Content } from '@/lib/types/content';

export async function getRecentContents(limit = 10): Promise<Content[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getContentsByCategory(
  category: string,
  limit = 20,
  cursor?: { updatedAt: string; id: string }
): Promise<Content[]> {
  const supabase = await createClient();
  let query = supabase
    .from('contents')
    .select('*')
    .eq('category', category)
    .eq('is_published', true)
    .order('updated_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.or(
      `updated_at.lt.${cursor.updatedAt},and(updated_at.eq.${cursor.updatedAt},id.lt.${cursor.id})`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getContentById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('contents')
    .select(`
      *,
      content_blocks (
        *,
        content_block_items (
          items (
            *,
            locations (*)
          )
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getAllContents(storeId?: string): Promise<Content[]> {
  const supabase = await createClient();
  let query = supabase.from('contents').select('*').order('updated_at', { ascending: false });
  if (storeId) query = query.eq('store_id', storeId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}
