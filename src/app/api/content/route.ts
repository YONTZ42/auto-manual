import { NextResponse } from 'next/server';
import { getAllContents } from '@/services/supabase/contentService';

export async function GET() {
  try {
    const data = await getAllContents();
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ data: [], error: String(e) });
  }
}
