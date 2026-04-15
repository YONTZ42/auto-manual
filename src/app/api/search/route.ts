import { NextResponse } from 'next/server';
import { searchContents, searchItems } from '@/services/supabase/searchService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';

  if (!q.trim()) {
    return NextResponse.json({ contents: [], items: [] });
  }

  try {
    const [contents, items] = await Promise.all([
      searchContents(q),
      searchItems(q),
    ]);
    return NextResponse.json({ contents, items });
  } catch {
    return NextResponse.json({ contents: [], items: [] });
  }
}
